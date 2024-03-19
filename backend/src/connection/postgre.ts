import { Pool } from 'pg';

import { DbConfig } from '../pkg/config';

export default class Pgsql {
  public pool: Pool;

  constructor(dbConf: DbConfig) {
    this.pool = new Pool({
      user: dbConf.dbUsername,
      host: dbConf.dbHost,
      database: dbConf.dbName,
      port: dbConf.dbPort,
    });
  }

  async validateConnection(){
    try {
      const result = await this.pool.query('SELECT 1');
      // if the db doesn't return any column means the db is invalid ,, which the code must not running
      result.rows.length || process.exit(1);
    } catch (error) {
      console.error('Error validating database connection:', error);
      process.exit(1)
    }
  }
}

