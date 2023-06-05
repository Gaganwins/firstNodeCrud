import mongoose, { model } from 'mongoose'
import { nanoid } from 'nanoid'
import ITemp from '../interface/ITemp'

export const { Schema } = mongoose

const tempSchema = new Schema<ITemp>({
  _id: {
    type: String,
    required: false,
    default: () => nanoid(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
    default: null,
  },
  entry_time: {
    type: String,
    required: true,
    default: null,
  },
})

export const tempModel = model('temps', tempSchema)
