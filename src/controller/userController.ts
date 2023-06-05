import { Request, Response } from 'express'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserStore from '../store/userStore'
import IUser, { IUserChangePassword, IUserResposeData } from '../interface/IUser'
import TempStore from '../store/tempStore'
import ITemp from '../interface/ITemp'
import Roles from '../utils/enum'
import SendResponse from '../utils/commonResponse'
import ErrorMessageEnum from '../utils/message'
import StatusCodeEnum from '../utils/statusCodeEnum'
import MailService from '../utils/mailService'
import CommonFunction from '../utils/commonFunction'
import { OTP_EXPIRE_TIME } from '../env'

const emailService = new MailService()
// const userStore = new UserStore()
const tempStore = new TempStore()
const commonFun = new CommonFunction(bcrypt, jwt)

export default class UserController {
  public storeUser: UserStore

  constructor(storeUser = new UserStore()) {
    this.storeUser = storeUser
    // this.signUpWithEmail = this.signUpWithEmail.bind(this)
  }

  public async create(req: Request, res: Response) {
    const schema = Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().optional(),
    })
    const params = schema.validate(req.body, { abortEarly: false })
    if (params.error) {
      // console.log(params.error);
      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST)
    }
    const { first_name, last_name, email, password } = params.value
    const hashPw: string = await commonFun.hashPassword(password)

    const userAttributes: IUser = {
      first_name,
      last_name,
      email,
      password: hashPw,
      role: Roles.User,
    }

    try {
      const user: IUser = await this.storeUser.createUser(userAttributes)
      if (user) {
        await tempStore.deleteRecord(userAttributes.email)
      }
      const responseData: IUserResposeData = {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
      }
      return SendResponse(res, responseData, StatusCodeEnum.OK)
    } catch (e) {
      if (e.name === 'MongoServerError' && e.code === 11000) {
        return SendResponse(res, ErrorMessageEnum.USER_EXIST, StatusCodeEnum.BAD_REQUEST)
      }
      return SendResponse(res, e, StatusCodeEnum.BAD_REQUEST)
    }
  }

  public async login(req: Request, res: Response) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    })
    const params = schema.validate(req.body, { abortEarly: false })
    if (params.error) {
      // console.log(error);
      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST)
    }
    const { email, password } = params.value

    const loginAttributes: Partial<IUser> = {
      email,
      password,
    }
    try {
      const user: IUser = await this.storeUser.findByAttribute({ email: loginAttributes.email })
      if (!user) {
        return SendResponse(res, ErrorMessageEnum.NOT_EXIST, StatusCodeEnum.NOT_FOUND)
      }
      const userPassword: string = user.password
      const matchPassword: boolean = await commonFun.comparePassword(password, userPassword)

      if (!matchPassword) {
        return SendResponse(res, ErrorMessageEnum.INVALID_PASSWORD, StatusCodeEnum.NOT_FOUND)
      }

      const token: string = await commonFun.generateToken(user._id, user.role)
      const data: object = {
        token,
        msg: ErrorMessageEnum.LOGGED_IN,
      }
      return SendResponse(res, data, StatusCodeEnum.OK)
    } catch (e) {
      return SendResponse(res, e)
    }
  }

  public async changePassword(req: Request, res: Response) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    })
    const params = schema.validate(req.body, { abortEarly: false })
    if (params.error) {
      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST)
    }
    const { email, oldPassword, newPassword } = params.value
    const changePasswordAttributes: IUserChangePassword = {
      email,
      oldPassword,
      newPassword,
    }
    try {
      const user: IUser = await this.storeUser.findByAttribute({ email: changePasswordAttributes.email })
      if (!user) {
        return SendResponse(res, ErrorMessageEnum.NOT_EXIST, StatusCodeEnum.NOT_FOUND)
      }
      const userPassword: string = user.password
      const matchPassword: boolean = await commonFun.comparePassword(oldPassword, userPassword)
      if (!matchPassword) {
        return SendResponse(res, ErrorMessageEnum.INVALID_PASSWORD, StatusCodeEnum.NOT_FOUND)
      }
      const hashPw: string = await commonFun.hashPassword(changePasswordAttributes.newPassword)
      await this.storeUser.updatePassword(user._id, hashPw)
      return SendResponse(res, ErrorMessageEnum.PSSWORD_UPDATE, StatusCodeEnum.OK)
    } catch (e) {
      return SendResponse(res, ErrorMessageEnum.INVALID_REQUEST)
    }
  }

  public async signUpWithEmail(req: Request, res: Response) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
    })
    const params = schema.validate(req.body, { abortEarly: false })
    if (params.error) {
      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST)
    }
    const { email } = params.value

    try {
      console.log(this.storeUser)
      const checkEmail: IUser = await this.storeUser.findByAttribute({ email })
      if (checkEmail) {
        return SendResponse(res, ErrorMessageEnum.USER_EXIST, StatusCodeEnum.BAD_REQUEST)
      }
      const otp: string = `${Math.random()}`.substring(2, 7)
      const d: Date = new Date()
      const time: number = d.getTime()
      const userAttributes: ITemp = {
        email,
        otp,
        entry_time: time.toString(),
      }
      await tempStore.createTempRecord(userAttributes)
      emailService.sendMailToUser(email, otp)
      return SendResponse(res, ErrorMessageEnum.SENT_MAIL, StatusCodeEnum.OK)
    } catch (e) {
      console.log(e)
      if (e.name === 'MongoServerError' && e.code === 11000) {
        return SendResponse(res, ErrorMessageEnum.USER_EXIST, StatusCodeEnum.BAD_REQUEST)
      }
      return SendResponse(res, ErrorMessageEnum.INVALID_REQUEST)
    }
  }

  public async compareOTP(req: Request, res: Response) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      otp: Joi.string().required(),
    })
    const params = schema.validate(req.body, { abortEarly: false })
    if (params.error) {
      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST)
    }
    const { email, otp } = params.value

    const time: Promise<number> = commonFun.getTimStamp()
    const compareAttributes: ITemp = {
      email,
      otp,
      entry_time: time.toString(),
    }
    try {
      const record: ITemp = await tempStore.compareOTP(compareAttributes.email)
      if (record) {
        const userAttributes: Partial<IUser> = {
          email,
          role: Roles.User,
        }
        const timeDiff: number = parseInt(compareAttributes.entry_time, 10) - parseInt(record.entry_time, 10)
        const secondsDifference: number = Math.floor(timeDiff / 1000)
        if (secondsDifference > OTP_EXPIRE_TIME) {
          await tempStore.deleteRecord(userAttributes.email)
          return SendResponse(res, ErrorMessageEnum.OTP_EXPIRE, StatusCodeEnum.OK)
        }
        if (compareAttributes.otp !== record.otp) {
          return SendResponse(res, ErrorMessageEnum.INVALID_OTP, StatusCodeEnum.BAD_REQUEST)
        }
        const user: IUser = await this.storeUser.createUser(userAttributes)
        if (user) {
          await tempStore.deleteRecord(userAttributes.email)
        }
        return SendResponse(res, { msg: ErrorMessageEnum.OTP_MATCH, _id: user._id }, StatusCodeEnum.OK)
      }
      return SendResponse(res, ErrorMessageEnum.NOT_EXIST, StatusCodeEnum.BAD_REQUEST)
    } catch (e) {
      console.log(e)
      return SendResponse(res, ErrorMessageEnum.INVALID_REQUEST)
    }
  }

  public async updateUser(req: Request, res: Response) {
    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      email: Joi.string().optional(),
      password: Joi.string().optional(),
      role: Joi.string().optional(),
    })
    const params = schema.validate(req.body, { abortEarly: false })
    if (params.error) {
      return SendResponse(res, params.error, StatusCodeEnum.BAD_REQUEST)
    }
    const { _id, first_name, last_name, email } = params.value

    const userAttributes: Partial<IUser> = {
      first_name,
      last_name,
      email,
      role: Roles.User,
    }
    const conditions: object = {
      _id,
    }
    try {
      const user: IUser = await this.storeUser.updateUser(conditions, userAttributes)
      if (user) {
        await tempStore.deleteRecord(userAttributes.email)
        return SendResponse(res, ErrorMessageEnum.USER_UPDATE, StatusCodeEnum.OK)
      }
      return SendResponse(res, ErrorMessageEnum.INVALID_REQUEST)
    } catch (e) {
      console.log(e)
      return SendResponse(res, ErrorMessageEnum.INVALID_REQUEST)
    }
  }
}
