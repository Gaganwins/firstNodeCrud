import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export default class CommonFunction {
    
    async comparePassword(password: string, userPassword: string){
        try{
            let matchPassword:boolean = await bcrypt.compare(password, userPassword);
            return matchPassword;
        }catch(e){
            console.log(e);
        }
    }
    async generateToken(id: string, role: string){
        try{
            const secret:string = process.env.JWT_SECRET;
            let token:string = await jwt.sign({ id:id, role: role }, secret, {
                expiresIn: '2h'
              });
            return token;
        }catch(e){
            console.log(e);
        }
    }
    async hashPassword(password: string){
        try{
            let hashPw:string = await bcrypt.hash(password,10);
            return hashPw;
        }catch(e){
            console.log(e);
        }
    }
    async getTimStamp(){
        try{
            const d: Date = new Date();
            const time: number = d.getTime();
            return time;
        }catch(e){
            console.log(e);
            return 0;
        }
    }
}