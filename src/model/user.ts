import mongoose, { model } from 'mongoose';
import userInterface from '../interface/IUser';
import { nanoid } from 'nanoid';
export const schema = mongoose.Schema;

const userSchema = new schema<userInterface>({
  _id: {
    type: String,
    required: false,
    default: () => nanoid()
  },
  first_name: {
    type: String,
    required: false,
    default: null
  },
  last_name: {
    type: String,
    required: false,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
    select: false
  },
  role: {
    type: String,
    required: true
  }
});

export const userModel = model('users', userSchema);
