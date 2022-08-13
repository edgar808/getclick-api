import {
  Authorized,
  Body, Delete, Get, HttpError, JsonController, Param, Post, Put, QueryParams,
} from 'routing-controllers';
import Services from '../../services';
import SignUpRequestDto from '../dto/user/SignUpRequestDto';
import UserUpdateDto from '../dto/user/UserUpdateDto';
import UserGetDto from '../dto/user/UserGetDto';
import { UserRoles } from '../dto/enum';
import { ERRORS, HTTP_CODES } from '../../constants';

@JsonController('/user')
@Authorized(UserRoles.Admin)
export default class UserController {
  @Post('/')
  async create(@Body({ required: true }) body: SignUpRequestDto) {
    if (body.role === UserRoles.Admin) throw new HttpError(HTTP_CODES.Conflict, ERRORS.ADMIN_RESTRICTION);
    const created = await Services.user.create({ data: body });
    return created;
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body({ required: true }) body: UserUpdateDto) {
    const update = await Services.user.update({ data: body, id });
    return update;
  }

  @Get('/')
  async getFilterSort(@QueryParams() query: UserGetDto) {
    const users = await Services.user.getFilterSort({ data: query });
    return users;
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const user = await Services.user.getById({ id });
    return user;
  }

  @Delete('/:id')
  async destroy(@Param('id') id: string) {
    const user = await Services.user.destroy({ id });
    return user;
  }
}
