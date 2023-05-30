import mongoose, {model} from "mongoose";
import ITemp from "../interface/ITemp";
import { nanoid } from "nanoid";
export const schema = mongoose.Schema;

const tempSchema = new schema<ITemp>({
    _id:{
        type: String,
        required: false,
        default: () => nanoid()
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    otp:{
        type:String,
        required:true,
        default:null
    },
    entry_time:{
        type:String,
        required:true,
        default:null
    }
});

export const tempModel = model("temps",tempSchema);