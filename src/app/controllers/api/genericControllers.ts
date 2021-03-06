import {
  bindContext,
  meTranslate,
  pipeMiddleware,
  respond,
} from '../utils/controllerUtils'
import { HttpContext } from '../utils/httpContext'

export const baseController = (
  serviceHandler: (context: HttpContext) => PromiseLike<any>,
  statusCode = 200
) =>
  pipeMiddleware(
    bindContext,
    meTranslate,
    respond(({ context }) => serviceHandler(context), statusCode)
  )
