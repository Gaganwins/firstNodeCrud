import IUser from "../interface/IUser";
import { userModel } from "../model/user";
import ErrorMessageEnum from '../utils/message';
export default class userStore {
    
    async createUser(attributes:Partial<IUser>){
        let user:IUser;
        try{
            user = await userModel.create(attributes);
            return user;
        }catch(e){
            if (e.name === 'MongoServerError' && e.code === 11000) {
                throw ErrorMessageEnum.USER_EXIST;
            }
            throw e;
        }
    }

    async findByAttribute(attribute: object){
        try{
            const user:IUser = await userModel.findOne(attribute);
            return user;
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    async updatePassword(_id: string, password:string){
        try{
            const user:IUser = await userModel.findOneAndUpdate({_id},{password});
            return user;
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    async updateUser(condition:object, attributes:Partial<IUser>){
        let user:IUser;
        try{
            user = await userModel.findOneAndUpdate(condition, attributes, {new: true});
            return user;
        }catch(e){
            console.log(e);
            throw e;
        }
    }
}