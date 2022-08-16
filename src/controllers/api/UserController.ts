import {
  CurrentUser, Get, JsonController,
} from 'routing-controllers';
import { Service, Inject } from 'typedi';
import UserDto from '../dto/user/UserDto';
import UserService from '../../services/User/User';

@Service()
@JsonController('/user')
export default class UserController {
  constructor(@Inject() private userService: UserService) {}

  @Get('/')
  async getById(@CurrentUser() user: UserDto) {
    const { id } = user;
    const users = await this.userService.getById({ id });
    return users;
  }
}
