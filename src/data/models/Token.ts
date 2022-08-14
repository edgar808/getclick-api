import {
  Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt, DataType, BelongsTo, ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';
import { Environment } from '../../config';
import { ERRORS } from '../../constants';
import { TokenType } from '../misc/enums';

@Table({
  timestamps: true,
  paranoid: true,
  schema: Environment.DB_SCHEMA,
  freezeTableName: true,
})

export class Token extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
    id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    userId: string;

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
    allowNull: true,
  })
    ip: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
    token: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(TokenType),
    validate: {
      isIn: {
        args: [Object.values(TokenType)],
        msg: ERRORS.INVALID_TYPE,
      },
    },
  })
    type: string;

  @CreatedAt
    creationDate: Date;

  @UpdatedAt
    updatedOn: Date;

  @DeletedAt
    deletionDate: Date;

  @BelongsTo(() => User, 'userId')
    user: object;
}
