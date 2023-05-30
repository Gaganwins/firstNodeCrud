export const JWT_SECRET: string = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
export const PORT: number = parseInt(process.env.PORT) || 3000
export const API_BASE_URL: string = process.env.API_BASE_URL || '/api/v1'
export const MONGODB_URL: string = process.env.MONGODB_URL || 'mongodb://localhost:27017/node-crud'
export const SENDER_MAIL_ID: string = process.env.SENDER_MAIL_ID || 'gagandeepkaurwins@gamil.com'
export const OTP_EXPIRE_TIME: number = parseInt(process.env.OTP_EXPIRE_TIME) || 180
