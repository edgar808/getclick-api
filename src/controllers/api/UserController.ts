import {
  CurrentUser, Get, JsonController,
} from 'routing-controllers';
import Services from '../../services';
import UserDto from '../dto/user/UserDto';

@JsonController('/user')
export default class UserController {
  @Get('/')
  async getById(@CurrentUser() user: UserDto) {
    const { id } = user;
    const users = await Services.user.getById({ id });
    return users;
  }
}
