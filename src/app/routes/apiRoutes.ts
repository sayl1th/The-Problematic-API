import { createRouter } from 'unicore'
import authRoutes from './authRoutes'
import problemRoutes from './problemRoutes'

const router = createRouter()

router.use('/auth', authRoutes)
router.use('/problems', problemRoutes)

export default router
