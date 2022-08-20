import {
  Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt, DataType, HasMany, ForeignKey, BelongsToMany,
} from 'sequelize-typescript';
import { Environment } from '../../config';
import { ERRORS } from '../../constants';
import { UserRoles } from '../misc/enums';
import { Category } from './Category';
import { Token } from './Token';
import { UserCategory } from './UserCategory';

@Table({
  timestamps: true,
  paranoid: true,
  schema: Environment.DB_SCHEMA,
  freezeTableName: true,
  indexes: [
    {
      unique: true,
      fields: ['id', 'email', 'username'],
    },
  ],
})

export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
    id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
    username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
    email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
    isVerified: boolean;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UserRoles),
    validate: {
      isIn: {
        args: [Object.values(UserRoles)],
        msg: ERRORS.INVALID_USER_ROLE,
      },
    },
  })
    role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    salt: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    phone: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
    viewPercent: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  })
    level: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  })
    nextLevel: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
    inviter: string;

  @CreatedAt
    creationDate: Date;

  @UpdatedAt
    updatedOn: Date;

  @DeletedAt
    deletionDate: Date;

  @HasMany(() => Token, 'userId')
    tokens: string[];

  @BelongsToMany(() => Category, {
    as: 'categories',
    through: () => UserCategory,
  })
    categories: string[];
}

