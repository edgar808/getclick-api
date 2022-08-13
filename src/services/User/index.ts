import Auth from './Auth';
import UserService from './User';

const auth = new Auth();
const user = new UserService();

export default {
  auth,
  user,
};
