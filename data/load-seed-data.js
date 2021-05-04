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
          INSERT INTO players (name, type, url, year, lives, is_sidekick)
          VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [player.name, player.type, player.url, player.year, player.lives, player.isSidekick]);
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