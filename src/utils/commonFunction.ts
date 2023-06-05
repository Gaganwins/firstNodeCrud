export default class CommonFunction {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public bcrypt: any

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public jwt: any

  public date: Date

  /* eslint-disable @typescript-eslint/no-explicit-any */
  constructor(bcrypt: any, jwt: any) {
    this.bcrypt = bcrypt
    this.jwt = jwt
    this.date = new Date()
  }

  async comparePassword(password: string, userPassword: string) {
    try {
      const matchPassword: boolean = await this.bcrypt.compare(password, userPassword)
      return matchPassword
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async generateToken(id: string, role: string) {
    try {
      const secret: string = process.env.JWT_SECRET
      const token: string = await this.jwt.sign({ id, role }, secret, {
        expiresIn: '2h',
      })
      return token
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async hashPassword(password: string) {
    try {
      const hashPw: string = await this.bcrypt.hash(password, 10)
      return hashPw
    } catch (e) {
      throw e
    }
  }

  async getTimStamp() {
    try {
      const time: number = this.date.getTime()
      return time
    } catch (e) {
      throw e
    }
  }
}
