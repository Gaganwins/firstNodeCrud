import express, { Router } from 'express'
import UserController from '../controller/userController'

const router: Router = express.Router()

const controller: UserController = new UserController()
router.post('/register', controller.create.bind(controller))
router.post('/login', controller.login.bind(controller))
router.post('/changePassword', controller.changePassword.bind(controller))
router.post('/signUpWithEmail', controller.signUpWithEmail.bind(controller))
router.post('/compareOTP', controller.compareOTP.bind(controller))
router.post('/updateUser', controller.updateUser.bind(controller))
export default router
