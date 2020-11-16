import { createRouter } from 'unicore'

import { baseController } from '../controllers/api/genericControllers'
import { hello } from '../services/helloService'
import problemRoutes from './problemRoutes'

const router = createRouter()

router.all('/hello/', baseController(hello))
router.use(problemRoutes)

export default router
