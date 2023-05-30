import express, { Router } from 'express'
import userController from '../controller/userController'

const router: Router = express.Router()

const controller: userController = new userController()
console.log('usercontroller')
router.post('/register', controller.create)
router.post('/login', controller.login)
router.post('/changePassword', controller.changePassword)
router.post('/signUpWithEmail', controller.signUpWithEmail)
router.post('/compareOTP', controller.compareOTP)
router.post('/updateUser', controller.updateUser)
export default router
