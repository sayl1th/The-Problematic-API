/* eslint-disable new-cap */
import { FindOperator, getRepository, In, Not } from 'typeorm'
import { HttpContext } from '../controllers/utils/httpContext'
import Problem from '../entities/Problem'
import Answer from '../entities/Answer'
import { NotFound } from '../errors/classes'

const create = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const { type, description } = context.payload
  const userId = context.user?.id
  const correctAnswer = type === 'riddle' ? 'It is 42' : '4'

  const problemDto = repository.create({
    userId,
    type,
    description,
    correctAnswer,
  })

  const data = await repository.save(problemDto)

  return { data }
}

const get = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const { id } = context.params

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
  const userId = context.user?.id

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

  const data = await repository.findAndCount({
    take: context.limit,
    skip: context.offset,
    where: {
      ...filter,
    },
  })

  if (data[0].length === 0) {
    throw new NotFound()
  }

  return {
    data: data[0],
    totalItems: data[1],
    totalPages: Math.ceil(data[1] / context.limit),
  }
}

const update = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const { id } = context.params
  const userId = context.user?.id

  const data = await repository.findOne(id, { where: { userId } })

  if (!data) {
    throw new NotFound()
  }

  const updatedData = repository.save({ id, ...context.payload })
  return { data: updatedData }
}

const remove = async (context: HttpContext) => {
  const repository = getRepository(Problem)

  const { id } = context.params
  const userId = context.user?.id

  const data = await repository.findOne(id, { where: { userId } })

  if (!data) {
    throw new NotFound()
  }

  await repository.remove(data)
  return { data }
}

const answerToProblem = async (context: HttpContext) => {
  const { answer } = context.payload
  const problemId = context.params.id
  const userId = context.user?.id
  const problemRepo = getRepository(Problem)

  const data = await problemRepo.findOne(problemId, {
    relations: ['acceptedAnswers'],
  })

  if (!data) {
    throw new NotFound()
  }

  if (data.correctAnswer === answer) {
    const repository = getRepository(Answer)

    const newAnswer = repository.create({ value: answer, userId })
    data.acceptedAnswers.push(newAnswer)
    await problemRepo.save(data)

    return { data: newAnswer }
  }

  return { data: 'Wrong Answer' }
}

export { create, get, getAll, update, remove, answerToProblem }
