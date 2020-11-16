import { createRouter } from 'unicore'
import { baseController } from '../controllers/api/genericControllers'
import * as problemController from '../controllers/api/problemController'
import * as problemService from '../services/problemService'
import { basicAuth } from '../controllers/utils/auth'

const router = createRouter()

router.use(basicAuth)

router
  .route('/')
  .post(problemController.createOne(problemService.create))
  .get(baseController(problemService.getAll))

router
  .route('/:id([0-9]+)')
  .get(baseController(problemService.get))
  .put(baseController(problemService.update))
  .delete(baseController(problemService.remove))

router.post('/:id/answer', baseController(problemService.answerToProblem))

export default router
