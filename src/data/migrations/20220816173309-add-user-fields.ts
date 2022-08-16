import { USER } from '../misc/resources';
import { Environment } from '../../config';

export default {

  up: async (queryInterface: any, Sequelize: any) => {
    const tableName = USER.MODEL;
    await queryInterface.addColumn(
      {
        tableName,
        schema: Environment.DB_SCHEMA,
      },
      'viewPercent',
      {
        required: false,
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
    );
    await queryInterface.addColumn(
      {
        tableName,
        schema: Environment.DB_SCHEMA,
      },
      'level',
      {
        required: false,
        allowNull: true,
        type: Sequelize.DOUBLE,
        default: 0,
      },
    );
    await queryInterface.addColumn(
      {
        tableName,
        schema: Environment.DB_SCHEMA,
      },
      'nextLevel',
      {
        required: false,
        allowNull: true,
        type: Sequelize.DOUBLE,
        default: 0,
      },
    );
    await queryInterface.addColumn(
      {
        tableName,
        schema: Environment.DB_SCHEMA,
      },
      'inviter',
      {
        required: false,
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: USER.MODEL, key: 'id' },
      },
    );
  },
};

