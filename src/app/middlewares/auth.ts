import { Response, Request, NextFunction } from 'express'
import { NotAuthenticated } from '../errors/classes'
import * as userService from '../services/userService'

export const basicAuth = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.includes('Basic ')
    ) {
      throw new NotAuthenticated()
    }

    const base64Credentials = req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString()

    const [username] = credentials.split(':')
    const user = await userService.authenticate(username)

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
