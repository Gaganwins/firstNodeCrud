import { Response } from 'express'
/* eslint-disable @typescript-eslint/no-explicit-any */
const SendResponse = (res: Response, data: any = { message: 'Invalid Request' }, status = 400) => {
  res.status(status).json({ data })
}
export default SendResponse
