import { Environment } from '../../config';
import { USER, TOKEN } from '../misc/resources';
import { TokenType } from '../misc/enums';

const tableName = TOKEN.MODEL;

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
        userId: {
          type: Sequelize.UUID,
          defaultValue: null,
          allowNull: true,
          references: { model: USER.MODEL, key: 'id' },
        },
        email: {
          required: false,
          allowNull: true,
          type: Sequelize.STRING(255),
          validate: {
            isEmail: true,
          },
        },
        token: {
          unique: true,
          required: true,
          allowNull: false,
          type: Sequelize.TEXT,
        },
        ip: {
          required: false,
          allowNull: true,
          type: Sequelize.STRING(255),
        },
        type: {
          required: true,
          allowNull: false,
          type: Sequelize.ENUM,
          values: Object.values(TokenType),
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
