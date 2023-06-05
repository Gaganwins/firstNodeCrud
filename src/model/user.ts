import mongoose, { model } from 'mongoose'
import { nanoid } from 'nanoid'
import userInterface from '../interface/IUser'

export const { Schema } = mongoose

const userSchema = new Schema<userInterface>({
  _id: {
    type: String,
    required: false,
    default: () => nanoid(),
  },
  first_name: {
    type: String,
    required: false,
    default: null,
  },
  last_name: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    // select: false,
  },
  role: {
    type: String,
    required: true,
  },
})

export const userModel = model('users', userSchema)
