import { UserModel } from 'src/models/User';

export const getUsers = () => {
  // get users from storage
  return JSON.parse(localStorage.getItem('user'));
};

export const setUsers = (user: UserModel) => {
  // set users from storage
  localStorage.setItem('user', JSON.stringify(user));
};
