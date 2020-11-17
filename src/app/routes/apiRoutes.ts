import { createRouter } from 'unicore'
import { baseController } from '../controllers/api/genericControllers'
import { hello } from '../services/helloService'
import authRoutes from './authRoutes'
import problemRoutes from './problemRoutes'

const router = createRouter()
router.all('/hello', baseController(hello))

router.use('/auth', authRoutes)
router.use('/problems', problemRoutes)

export default router
