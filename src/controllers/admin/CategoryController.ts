import {
  Authorized,
  Body, Delete, Get, JsonController, Param, Post, Put, QueryParams,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import CategoryRequestDto from '../dto/category/CategoryRequestDto';
import { UserRoles } from '../dto/enum';
import CategoryService from '../../services/Category/Category';
import { QueryParamSearchDto } from '../dto/QueryParamsDto';

@Service()
@JsonController('/category')
@Authorized(UserRoles.Admin)
export default class CategoryController {
  constructor(@Inject() private categoryService: CategoryService) {}

  @Authorized([UserRoles.Individual, UserRoles.Business])
  @Post('/')
  async create(@Body({ required: true }) body: CategoryRequestDto) {
    await this.categoryService.create({ data: body });
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body({ required: true }) body: CategoryRequestDto) {
    await this.categoryService.update({ data: body, id });
  }

  @Get('/')
  async get(@QueryParams() query: QueryParamSearchDto) {
    return this.categoryService.get(query);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: string) {
    await this.categoryService.destroy({ id });
  }
}
