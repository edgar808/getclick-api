import {
  Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt, DataType, BelongsToMany,
} from 'sequelize-typescript';
import { Environment } from '../../config';
import { User } from './User';

@Table({
  timestamps: true,
  paranoid: true,
  schema: Environment.DB_SCHEMA,
  freezeTableName: true,
})

export class Category extends Model {
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
    name: string;

  @CreatedAt
    creationDate: Date;

  @UpdatedAt
    updatedOn: Date;

  @DeletedAt
    deletionDate: Date;

  // @BelongsToMany(()=>User, {
  //   through:'UserCategory',
  //   foreignKey: 'categoryId',
  //   // as: 'users'
  // })
  //   users:string[];
}
