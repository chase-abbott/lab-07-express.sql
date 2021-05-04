/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import players from './players.js';

run();

async function run() {

  try {

    await Promise.all(
      players.map(player => {
        return client.query(`
          INSERT INTO players (name, position, year_enrolled, is_transfer, is_active )
          VALUES ($1, $2, $3, $4, $5);
        `,
        [player.name, player.position, player.yearEnrolled, player.isTransfer, player.isActive]);
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