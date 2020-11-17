import { createRouter } from 'unicore'
import { baseController } from '../controllers/api/genericControllers'
import * as problemService from '../services/problemService'
import { basicAuth } from '../middlewares/auth'
import problemRules from '../middlewares/problemRules'
import validator from '../middlewares/customValidator'

const router = createRouter()

router.use(basicAuth)

router
  .route('/')
  .post(problemRules, validator, baseController(problemService.create, 201))
  .get(baseController(problemService.getAll))

router
  .route('/:id([0-9]+)')
  .get(baseController(problemService.get))
  .put(problemRules, validator, baseController(problemService.update, 204))
  .delete(baseController(problemService.remove, 204))

router.post('/:id/answer', baseController(problemService.answerToProblem))

export default router
