import { createRouter } from 'unicore'
import { baseController } from '../controllers/api/genericControllers'
import { hello } from '../services/helloService'
import * as problemController from '../controllers/api/problemController'
import problemService from '../services/problemService'

const router = createRouter()

const service = problemService()

router.all('/hello/', baseController(hello))

router
  .route('/problem')
  .post(problemController.createOne(service.create))
  .get(baseController(service.getAll))

router
  .route('/problem/:id([0-9]+)')
  .get(baseController(service.get))
  .put(baseController(service.update))
  .delete(baseController(service.remove))

router.post('/problem/:id/answer', baseController(service.answerToProblem))
export default router
