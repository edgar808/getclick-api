import { Action, HttpError, UnauthorizedError } from 'routing-controllers';
import UserDto from '../controllers/dto/user/UserDto';
import { verify } from '../utils/jwt';
import { UserRoles } from '../controllers/dto/enum';
import { Environment } from '../config';
import { User } from '../data/models/User';
import { ERRORS, HTTP_CODES } from '../constants';

const getUserFromToken = async (action: Action): Promise<UserDto> => {
  const authHeader = action.request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token is required');
  }
  const token = authHeader.split(' ')[1];
  const { userId } = await verify(token, Environment.AccessTokenSecret);
  const user = await User.findByPk(userId);
  if (!user) throw new HttpError(HTTP_CODES.BadRequest, ERRORS.RESOURCE_NOT_FOUND);
  const userDto = user.toJSON();
  action.request.user = userDto;
  return userDto;
};

export const basic = async (action: Action) => {
  const authHeader = action.request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    throw new UnauthorizedError('Token is required');
  }
  const token = authHeader.split(' ')[1];
  const parseToken = Buffer.from(token, 'base64').toString('ascii');
  const [username, password] = parseToken.split(':');
  for (let i = 0; i < Environment.AuthUser.length; i++) {
    if (Environment.AuthUser[i] === username && Environment.AuthPass[i] === password) {
      return true;
    }
  }
  throw new UnauthorizedError('Token is not valid');
};

export const bearer = async (action: Action, roles: UserRoles[]) => {
  const user = await getUserFromToken(action);
  return roles.includes(user.role);
};

export const currentUserChecker = async (action: Action) => getUserFromToken(action);
