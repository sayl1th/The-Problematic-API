import { getRepository } from 'typeorm'
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

  const data = await repository.find()

  if (data.length === 0) {
    throw new NotFound()
  }

  return { data }
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
  const problemRepo = getRepository(Problem)

  const data = await problemRepo.findOne(problemId, {
    relations: ['acceptedAnswer'],
  })

  if (!data) {
    throw new NotFound()
  }

  if (data.correctAnswer === answer) {
    const repository = getRepository(Answer)

    if (!data.acceptedAnswer) {
      const newAnswer = repository.create({ value: answer })
      data.acceptedAnswer = newAnswer
      await problemRepo.save(data)
      return { data: newAnswer }
    }

    return { data: data.acceptedAnswer }
  }

  return { data: 'Wrong Answer' }
}

export { create, get, getAll, update, remove, answerToProblem }
