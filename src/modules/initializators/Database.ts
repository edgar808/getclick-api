import DB from '../../data/models';

class Database {
  logging: any;

  constructor(logging = false) {
    this.logging = logging;
  }

  async init() {
    await DB.sequelize.authenticate();
    console.info('Connected to postgres SQL database ✅');
  }
}

export default Database;
