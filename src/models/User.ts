export interface UserModel {
  userId?: string;
  name: string;
  mail: string;
  password?: string;
}

export type UsersModel = Array<UserModel>;
