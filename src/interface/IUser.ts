export default interface IUser {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}
export interface IUserResposeData {
  _id?: string;
  name: string;
}
export interface IUserChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}
