import IUser from '../interface/IUser'
import { userModel } from '../model/user'

export default class UserStore {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public model: any

  constructor(model = userModel) {
    this.model = model
  }

  async createUser(attributes: Partial<IUser>) {
    let user: IUser
    try {
      user = await this.model.create(attributes)
      return user
    } catch (e) {
      throw e
    }
  }

  async findByAttribute(attribute: object) {
    try {
      const user: IUser = await this.model.findOne(attribute)
      return user
    } catch (e) {
      throw e
    }
  }

  async updatePassword(_id: string, password: string) {
    try {
      const user: IUser = await this.model.findOneAndUpdate({ _id }, { password })
      return user
    } catch (e) {
      throw e
    }
  }

  async updateUser(condition: object, attributes: Partial<IUser>) {
    let user: IUser
    try {
      user = await this.model.findOneAndUpdate(condition, attributes, { new: true })
      return user
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
