import { getRepository } from 'typeorm'
import { HttpJsonError } from 'unicore'
import { HttpContext } from '../controllers/utils/httpContext'
import Problem from '../entities/Problem'

const problemService = () => {
  const create = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { type, description } = context.payload
    const problemDto = repository.create({ type, description })
    const problem = await repository.save(problemDto)

    return Promise.resolve({ data: problem })
  }

  const get = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { id } = context.params
    const problem = await repository.findOne(id)

    if (problem) {
      return Promise.resolve({ data: problem })
    }

    throw new HttpJsonError(404, 'Not Found')
  }

  const getAll = async () => {
    const repository = getRepository(Problem)

    const problems = await repository.find()

    if (problems.length > 0) {
      return problems
    }

    throw new HttpJsonError(404, 'Not Found')
  }

  const update = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { id } = context.params
    const problem = await repository.findOne(id)

    if (problem) {
      return repository.save({ id, ...context.payload })
    }

    throw new HttpJsonError(404, 'Not Found')
  }

  const remove = async (context: HttpContext) => {
    const repository = getRepository(Problem)

    const { id } = context.params
    const problem = await repository.findOne(id)

    if (problem) {
      return repository.remove(problem)
    }

    throw new HttpJsonError(404, 'Not Found')
  }

  return { create, get, getAll, update, remove }
}

export default problemService
