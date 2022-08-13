import { DB_SCHEMA } from '../../config';
import { USER } from '../misc/resources';
import { UserRoles } from '../misc/enums';

const tableName = USER.MODEL;

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName,
        schema: DB_SCHEMA,
      },
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
        },
        username: {
          allowNull: false,
          unique: true,
          required: true,
          type: Sequelize.STRING,
        },
        email: {
          unique: true,
          required: true,
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            isEmail: true,
          },
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          required: true,
        },
        isVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        role: {
          type: Sequelize.ENUM,
          values: Object.values(UserRoles),
        },
        password: {
          required: false,
          allowNull: true,
          type: Sequelize.STRING(1024),
        },
        salt: {
          required: false,
          allowNull: true,
          type: Sequelize.STRING(1024),
        },
        phone: {
          required: false,
          allowNull: true,
          type: Sequelize.STRING(255),
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
        schema: DB_SCHEMA,
      },
    );
  },
};
