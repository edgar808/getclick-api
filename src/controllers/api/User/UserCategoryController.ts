import {
  Body,
  CurrentUser, Delete, JsonController, Param, Post,
} from 'routing-controllers';
import { Service, Inject } from 'typedi';
import UserDto from '../../dto/user/UserDto';
import UserCategoryService from '../../../services/User/Category';
import UserCategoryRequestDto from '../../dto/user/UserCategoryRequestDto';

@Service()
@JsonController('/user/category')
export default class UserCategoryController {
  constructor(@Inject() private userCategoryService: UserCategoryService) {}

  @Post('/')
  async create(@Body({ required: true }) body: UserCategoryRequestDto, @CurrentUser() user: UserDto) {
    const { id } = user;
    const { categoryId } = body;
    await this.userCategoryService.create({ userId: id, categoryId });
  }

  @Delete('/:categoryId')
  async delete(@Param('categoryId') categoryId: string, @CurrentUser() user: UserDto) {
    const { id } = user;
    await this.userCategoryService.delete({ userId: id, categoryId });
  }
}
