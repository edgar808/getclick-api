import {
  Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt, DataType, ForeignKey,
} from 'sequelize-typescript';
import { Environment } from '../../config';
import { User } from './User';
import { Category } from './Category';

@Table({
  timestamps: true,
  paranoid: false,
  schema: Environment.DB_SCHEMA,
  freezeTableName: true,
})

export class UserCategory extends Model {
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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    categoryId: string;

  @CreatedAt
    creationDate: Date;

  @UpdatedAt
    updatedOn: Date;

  @DeletedAt
    deletionDate: Date;
}
