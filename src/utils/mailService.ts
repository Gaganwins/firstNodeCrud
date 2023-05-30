import {SENDER_MAIL_ID} from '../env';
const sendmail = require('sendmail')();

export default class MailService {
    //SEND MAIL
    async sendMailToUser(email:string, otp: string){
        return new Promise(function(resolve, reject) {
            sendmail({
                from: SENDER_MAIL_ID,
                to: email,
                subject: 'Match OTP',
                html: "Your OTP is "+otp+ " don't share with anyone",
            }, function(err, reply) {
                if(err){
                    reject(false);
                }else{
                    resolve(otp);
                }
            });
        });
    }
}