import { createRouter } from 'unicore'
import { baseController } from '../controllers/api/genericControllers'
import * as problemController from '../controllers/api/problemController'
import problemService from '../services/problemService'

const service = problemService()

const router = createRouter()

router
  .route('/problem')
  .post(problemController.createOne(service.create))
  .get(baseController(service.getAll))

router
  .route('/problem/:id([0-9]+)')
  .get(baseController(service.get))
  .put(baseController(service.update))
  .delete(baseController(service.remove))

export default router
