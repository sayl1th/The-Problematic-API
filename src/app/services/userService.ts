import { getRepository } from 'typeorm'
import { HttpContext } from '../controllers/utils/httpContext'
import User from '../entities/User'
import { NotAuthorized } from '../errors/classes'

export const authenticate = async (username: string) => {
  const repository = getRepository(User)
  const user = await repository.findOne({ username })

  if (!user) {
    throw new NotAuthorized()
  }

  return user
}

export const register = (context: HttpContext) => {
  const { username } = context.payload

  const repository = getRepository(User)
  return repository.save({ username })
}
