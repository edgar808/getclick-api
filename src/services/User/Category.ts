import { HttpError, NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';
import { ERRORS, HTTP_CODES } from '../../constants';
import { UserCategory } from '../../data/models/UserCategory';

@Service()
export default class UserCategoryService {
  async create({ userId, categoryId }: { userId: string, categoryId: string }) {
    const userCategory = await UserCategory.findOne({ where: { userId, categoryId } });
    if (userCategory) throw new HttpError(HTTP_CODES.Conflict, ERRORS.ALREADY_CREATED);
    await UserCategory.create({
      userId,
      categoryId,
    });
  }

  async delete({ userId, categoryId }: { userId: string, categoryId: string }) {
    console.log(111);
    console.log(userId);
    console.log(categoryId);

    const userCategory = await UserCategory.findOne({ where: { userId, categoryId } });
    if (!userCategory) throw new NotFoundError(ERRORS.RESOURCE_NOT_FOUND);
    await userCategory.destroy();
  }
}
