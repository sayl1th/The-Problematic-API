import { createRouter } from 'unicore'
import { baseController } from '../controllers/api/genericControllers'
import { register } from '../services/userService'

const router = createRouter()

router.route('/register').post(baseController(register, 201))

export default router
