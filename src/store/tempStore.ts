import ITemp from '../interface/ITemp'
import { tempModel } from '../model/temp'
export default class tempStore {
  async createTempRecord(attributes: ITemp) {
    let record: ITemp
    try {
      record = await tempModel.create(attributes)
      return record
    } catch (e) {
      console.log(e)
    }
  }
  async compareOTP(email: string) {
    try {
      const user: ITemp = await tempModel.findOne({ email })
      return user
    } catch (e) {
      console.log(e)
    }
  }
  async deleteRecord(email: string) {
    try {
      return await tempModel.findOneAndDelete({ email })
    } catch (e) {
      console.log(e)
    }
  }
}
