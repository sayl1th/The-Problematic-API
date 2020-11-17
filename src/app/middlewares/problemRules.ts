import { body } from 'express-validator'

const types = ['riddle', 'expression']

export default [
  body('type')
    .not()
    .isEmpty()
    .withMessage('type must not be empty')
    .isString()
    .withMessage('type must be a string')
    .trim()
    .isIn(types)
    .withMessage(`type must be either ${types[0]} or ${types[1]}`),

  body('description')
    .not()
    .isEmpty()
    .withMessage('description must not be empty')
    .isString()
    .withMessage('description must be a string')
    .trim(),
]
