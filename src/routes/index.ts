import { Router } from 'express';

import userRouter from './userRoutes';
import * as dotenv from 'dotenv';
dotenv.config();

const router:Router = Router();

router.use(process.env.API_BASE_URL+'/user', userRouter);

export default router;