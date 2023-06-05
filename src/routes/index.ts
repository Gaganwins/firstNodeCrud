import { Router } from 'express'

import * as dotenv from 'dotenv'
import userRouter from './userRoutes'

dotenv.config()

const router: Router = Router()

router.use(`${process.env.API_BASE_URL}/user`, userRouter)

export default router
