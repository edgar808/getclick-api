import { Environment } from '../../config';
import { USER, USER_CATEGORY, CATEGORY } from '../misc/resources';

const tableName = USER_CATEGORY.MODEL;

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName,
        schema: Environment.DB_SCHEMA,
      },
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
        },
        categoryId: {
          type: Sequelize.UUID,
          required: true,
          allowNull: false,
          references: { model: CATEGORY.MODEL, key: 'id' },
        },
        userId: {
          type: Sequelize.UUID,
          required: true,
          allowNull: false,
          references: { model: USER.MODEL, key: 'id' },
        },
        creationDate: {
          defaultValue: Sequelize.NOW,
          type: Sequelize.DATE,
        },
        updatedOn: {
          allowNull: Sequelize.NOW,
          type: Sequelize.DATE,
        },
        deletionDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(
      {
        tableName,
        schema: Environment.DB_SCHEMA,
      },
    );
  },
};
