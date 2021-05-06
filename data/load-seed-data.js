/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import players from './players.js';
import { users } from './users.js';
run();

async function run() {

  try {
    const data = await Promise.all(
      users.map(user => {
        return client.query(`
        INSERT INTO users (name, email, password)
        VALUES($1, $2, $3)
        RETURNING *
        `,
        [user.name, user.email, user.password]);
      })
    );
    const user = data[0].rows[0];
    await Promise.all(
   
      players.map(player => {
        return client.query(`
          INSERT INTO players (name, position, year_enrolled, is_transfer, is_active, user_id )
          VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [player.name, player.position, player.yearEnrolled, player.isTransfer, player.isActive, user.id]);
      })
    );
    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}