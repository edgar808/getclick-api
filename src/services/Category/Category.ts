import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { Op } from 'sequelize';
import { Environment } from '../../config';
import { ERRORS, HTTP_CODES } from '../../constants';
import { Category } from '../../data/models/Category';
import CategoryType from './typing/CategoryType';

@Service()
export default class CategoryService {
  async get({ limit = Environment.Pagination.Limit, offset = Environment.Pagination.Offset, searchKay }) {
    const where = searchKay
      ? { name: { [Op.iLike]: `%${searchKay}%` } }
      : {};
    return Category.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit,
      offset,
    });
  }

  async create({ data }:{ data: CategoryType }) {
    const category = await Category.create({ ...data });
    return category.toJSON();
  }

  async update({ data, id } : { data: CategoryType, id: string }) {
    const category = await Category.findByPk(id);
    if (!category) throw new HttpError(HTTP_CODES.BadRequest, ERRORS.RESOURCE_NOT_FOUND);
    await category.update(data);
  }

  async destroy({ id } : { id: string }) {
    const category = await Category.findByPk(id);
    if (!category) throw new HttpError(HTTP_CODES.BadRequest, ERRORS.RESOURCE_NOT_FOUND);
    await category.destroy();
  }
}
