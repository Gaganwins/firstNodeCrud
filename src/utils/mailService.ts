import { SENDER_MAIL_ID } from '../env'
/* eslint-disable @typescript-eslint/no-var-requires */
const sendmail = require('sendmail')()

export default class MailService {
  public sender_id: string

  constructor(sender_id = SENDER_MAIL_ID) {
    this.sender_id = sender_id
  }

  // SEND MAIL
  async sendMailToUser(email: string, otp: string) {
    return new Promise((resolve, reject) => {
      sendmail(
        {
          from: this.sender_id,
          to: email,
          subject: 'Match OTP',
          html: `Your OTP is ${otp} don't share with anyone`,
        },
        (err) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(otp)
          }
        },
      )
    })
  }
}
