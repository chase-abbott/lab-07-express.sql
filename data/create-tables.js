/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {
    // run a query to create tables
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(64) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(64) NOT NULL
      );

      CREATE TABLE players (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(64) NOT NULL,
        position VARCHAR(32) NOT NULL,
        year_enrolled INTEGER NOT NULL,
        is_transfer BOOLEAN NOT NULL,
        is_active BOOLEAN DEFAULT FALSE,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete');
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}