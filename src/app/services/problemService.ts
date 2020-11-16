import { getRepository } from 'typeorm'
import { HttpContext } from '../controllers/utils/httpContext'
import Problem from '../entities/Problem'
import Answer from '../entities/Answer'
import { NotFound } from '../errors/classes'

const problemService = () => {
  const create = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { type, description } = context.payload
    const correctAnswer = type === 'riddle' ? 'It is 42' : '4'
    const problemDto = repository.create({ type, description, correctAnswer })
    const problem = await repository.save(problemDto)

    return { data: problem }
  }

  const get = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { id } = context.params
    const data = await repository.findOne(id)

    if (data) {
      return { data }
    }

    throw new NotFound()
  }

  const getAll = async () => {
    const repository = getRepository(Problem)

    const data = await repository.find()

    if (data.length > 0) {
      return { data }
    }

    throw new NotFound()
  }

  const update = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { id } = context.params
    const data = await repository.findOne(id)

    if (data) {
      const updatedData = repository.save({ id, ...context.payload })
      return { data: updatedData }
    }

    throw new NotFound()
  }

  const remove = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { id } = context.params
    const data = await repository.findOne(id)

    if (data) {
      await repository.remove(data)
      return { data }
    }

    throw new NotFound()
  }

  const answerToProblem = async (context: HttpContext) => {
    const { answer } = context.payload
    const problemId = context.params.id
    const problemRepo = getRepository(Problem)

    const data = await problemRepo.findOne(problemId, {
      relations: ['correctAnswers'],
    })

    if (!data) {
      throw new NotFound()
    }

    if (data.correctAnswer === answer) {
      const repository = getRepository(Answer)

      const existingAnswer = data.correctAnswers.find(o => o.value === answer)

      if (!existingAnswer) {
        const newAnswer = repository.create({ value: answer })

        data.correctAnswers.push(newAnswer)
        await problemRepo.save(data)

        return { data: newAnswer }
      }

      return { data: existingAnswer }
    }

    return { data: 'Wrong Answer' }
  }

  return { create, get, getAll, update, remove, answerToProblem }
}

export default problemService
