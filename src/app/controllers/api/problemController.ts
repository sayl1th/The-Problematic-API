import {
  bindContext,
  meTranslate,
  pipeMiddleware,
  respond,
} from '../utils/controllerUtils'
import { HttpContext } from '../utils/httpContext'

export const createOne = (
  serviceHandler: (context: HttpContext) => PromiseLike<any>
) =>
  pipeMiddleware(
    bindContext,
    meTranslate,
    respond(({ context }) => serviceHandler(context), 201)
  )
