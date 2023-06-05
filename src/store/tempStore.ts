import ITemp from '../interface/ITemp'
import { tempModel } from '../model/temp'

export default class tempStore {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public model: any

  constructor(model = tempModel) {
    this.model = model
  }

  async createTempRecord(attributes: ITemp) {
    try {
      const record: ITemp = await this.model.create(attributes)
      return record
    } catch (e) {
      throw e
    }
  }

  async compareOTP(email: string) {
    try {
      const user: ITemp = await this.model.findOne({ email })
      return user
    } catch (e) {
      throw e
    }
  }

  async deleteRecord(email: string) {
    try {
      return await this.model.findOneAndDelete({ email })
    } catch (e) {
      throw e
    }
  }
}
