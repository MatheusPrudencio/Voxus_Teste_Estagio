// Update with your config settings.
const path = require('path')

module.exports = {

  development: {
    client: 'pg',
    connection: {
      filename: './database',
      user: 'postgres',
      password: 'bbd8174b404443a4821def08c39cdf2d'
    },
    migrations: {
      directory: __dirname +'/database/migrations'
    },
    seeds: {
      directory: __dirname +'/database/seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
