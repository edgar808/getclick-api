import * as crypto from 'crypto';
import { HttpError, NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';
import SignUpType from './typing/SignUpType';
import UserUpdateType from './typing/UserUpdateType';
import UserGetType from './typing/UserGetType';
import { User } from '../../data/models/User';
import { Environment } from '../../config';
import { ERRORS, HTTP_CODES } from '../../constants';
import { Category } from '../../data/models/Category';
import { CATEGORY } from '../../data/misc/resources';

@Service()
export default class UserService {
  async create({ data }: { data: SignUpType }) {
    const existUser = await User.findOne({ where: { email: data.email } });
    if (existUser) throw new HttpError(HTTP_CODES.Conflict, ERRORS.USERNAME_ALREADY_EXIST);
    const username = await this.getRandomUsername({ email: data.email });

    const salt = crypto.randomBytes(Environment.CryptoConfig.hash.length).toString('hex');
    const password = await this.generatePassword(salt, data.password);

    await User.create({
      username,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      password,
      salt,
    });
  }

  async update({ id, data }: { id: string, data: UserUpdateType }) {
    const user = await User.findByPk(id, { attributes: { exclude: ['password', 'salt'] } });
    if (!user) throw new NotFoundError(ERRORS.USER_NOT_FOUND);
    await user.update(data);
  }

  async getById({ id }: { id: string }) {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password', 'salt'] },
      include: [
        {
          model: Category,
          as: CATEGORY.ALIAS.PLURAL,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });
    if (!user) throw new NotFoundError(ERRORS.USER_NOT_FOUND);
    return user;
  }

  async getFilterSort({ data }:{ data:UserGetType }) {
    const {
      sortField = 'creationDate', sortOrder = 'DESC', isVerified, role, limit = 0, offset = 50,
    } = data;
    const where:any = {};

    if (role) where.role = role;
    if (isVerified) where.isVerified = isVerified;
    const query: object = {
      attributes: { exclude: ['password', 'salt'] },
      where,
      order: [[sortField, sortOrder]],
      limit,
      offset,
    };

    return User.findAndCountAll(query);
  }

  async destroy({ id }: { id: string }) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError(ERRORS.USER_NOT_FOUND);
    await user.destroy();
    return true;
  }

  /* end CRUD */

  /* AUTH CHANGES */

  async getRandomUsername({ email }: any) {
    const [name] = email.split('@');
    return this.getRandomString({ str: name, withRandomString: false });
  }

  async getRandomString({ str, withRandomString = true }: any) {
    let name = str;
    if (withRandomString) {
      const random = Math.floor(
        Math.random() * (9999 - 1000) + 1000,
      );
      name += random;
    }
    const existUser = await this.getOneByCondition({ condition: { username: name }, options: { paranoid: false } });
    if (!existUser) return name;
    return this.getRandomString(str);
  }

  async getOneByCondition({
    condition,
    options,
  }: any) {
    return User.findOne({ where: condition, ...options });
  }

  async getByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new HttpError(HTTP_CODES.BadRequest, ERRORS.RESOURCE_NOT_FOUND);
    return user;
  }

  async generatePassword(salt: any, password: any) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        Environment.CryptoConfig.hash.iterations,
        Environment.CryptoConfig.hash.length,
        'sha512',
        (err, key) => {
          if (err) return reject(err);
          return resolve(key.toString('hex'));
        },
      );
    });
  }

  async setPassword(password: any, user:any) {
    const salt = crypto.randomBytes(Environment.CryptoConfig.hash.length).toString('hex');
    password = await this.generatePassword(salt, password);
    await user.update({
      password,
      salt,
    });
  }
  /* END AUTH CHANGES */
}
