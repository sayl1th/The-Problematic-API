import { NextFunction, Request, Response } from 'express'
import { ValidationError, validationResult } from 'express-validator'
import { ValidationError as CustomValidationError } from '../errors/classes'

export default (
  req: Request,
  _: Response,
  next: NextFunction
): Response<void> | void => {
  const errorFormatter = (error: ValidationError) => {
    return error.msg
  }

  const results = validationResult(req).formatWith(errorFormatter)

  if (!results.isEmpty()) {
    throw new CustomValidationError({}, results.mapped())
  }

  return next()
}
