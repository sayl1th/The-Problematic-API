/* eslint-disable no-eval */
/* eslint-disable new-cap */
import { FindOperator, getRepository, In, Not } from 'typeorm'
import { HttpContext } from '../controllers/utils/httpContext'
import Problem from '../entities/Problem'
import Answer from '../entities/Answer'
import { NotFound } from '../errors/classes'
import config from '../../config'

const create = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const { type, description } = context.payload
  const userId = parseInt(context.user?.id, 10)

  const problemDto = repository.create({
    userId,
    type,
    description,
  })

  const data = await repository.save(problemDto)

  return { data }
}

const get = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const id = parseInt(context.params.id)

  const data = await repository.findOne(id)

  if (!data) {
    throw new NotFound()
  }

  return { data }
}

const getAll = async (context: HttpContext) => {
  const repository = getRepository(Problem)
  const answersRepo = getRepository(Answer)

  const filter: { id?: FindOperator<number>; type?: FindOperator<string> } = {}
  const userId = parseInt(context.user?.id, 10)

  if (context.params.type) {
    const { type } = context.params
    filter.type = Array.isArray(type) ? In(type) : In([type])
  }

  if (context.params.isAnswered) {
    const isAnswered = context.params.isAnswered === 'true'
    const answeredProblemsIds = (
      await answersRepo.find({ where: { userId } })
    ).map(a => a.problemId)

    filter.id = isAnswered
      ? In(answeredProblemsIds)
      : Not(In(answeredProblemsIds))
  }

  const [data, count] = await repository.findAndCount({
    take: context.limit,
    skip: context.offset,
    where: {
      ...filter,
    },
  })

  return {
    data: data,
    totalItems: count,
    totalPages: Math.ceil(count / context.limit),
  }
}

const update = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const id = parseInt(context.params.id)
  const userId = parseInt(context.user?.id, 10)

  const data = await repository.findOne(id, { where: { userId } })

  if (!data) {
    throw new NotFound()
  }

  await repository.save({ id, userId, ...context.payload })
}

const remove = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const id = parseInt(context.params.id)
  const userId = parseInt(context.user?.id, 10)

  const data = await repository.findOne(id, { where: { userId } })

  if (!data) {
    throw new NotFound()
  }

  await repository.remove(data)
}

const answerToProblem = async (context: HttpContext) => {
  const { answer } = context.payload

  const id = parseInt(context.params.id)
  const userId = parseInt(context.user?.id, 10)

  const problemRepo = getRepository(Problem)

  const data = await problemRepo.findOne(id, {
    relations: ['acceptedAnswers'],
  })

  if (!data) {
    throw new NotFound()
  }

  const correctAnswer =
    data.type === 'riddle' ? config.staticAnswer : eval(data.description)

  if (correctAnswer === answer) {
    const repository = getRepository(Answer)

    const newAnswer = repository.create({ value: answer, userId })
    data.acceptedAnswers.push(newAnswer)
    await problemRepo.save(data)

    return { data: newAnswer }
  }

  return { error: 'Wrong Answer' }
}

export { create, get, getAll, update, remove, answerToProblem }
