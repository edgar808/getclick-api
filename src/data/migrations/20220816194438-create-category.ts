import { Environment } from '../../config';
import { CATEGORY } from '../misc/resources';

const tableName = CATEGORY.MODEL;

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
        name: {
          type: Sequelize.STRING,
          required: true,
          allowNull: false,
          unique: true,
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
