import {
  Authorized, Get, JsonController, QueryParams,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { UserRoles } from '../dto/enum';
import CategoryService from '../../services/Category/Category';
import { QueryParamSearchDto } from '../dto/QueryParamsDto';

@Service()
@JsonController('/category')
@Authorized([UserRoles.Individual, UserRoles.Business])
export default class CategoryController {
  constructor(@Inject() private categoryService: CategoryService) {}

  @Get('/')
  async get(@QueryParams() query: QueryParamSearchDto) {
    return this.categoryService.get(query);
  }
}
