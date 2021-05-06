/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Oregon Football Players API');
});

// API routes,
app.post('/api/auth/signup', async (req, res) => {
  try{
    const user = req.body;
    const data = await client.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email;
    `,
    [user.name, user.email, user.password]);
    res.json(data.rows[0]);
  }
  catch(err){
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/players', async (req, res) => {
  // use SQL query to get data...
  try {
    
    const data = await client.query(`
     SELECT  	  p.id,
                p.name,
                position,
                year_enrolled as "yearEnrolled",
                is_transfer as "isTransfer",
                is_active as "isActive",
                p.user_id as "userId",
                u.name as "userName"
    FROM    players p
    JOIN 	  users u
      ON 	  p.user_id = u.id
    `);

    // send back the data
    res.json(data.rows); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/players/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
    SELECT  p.id,
            p.name,
            position,
            year_enrolled as "yearEnrolled",
            is_transfer as "isTransfer",
            is_active as "isActive",
            p.user_id as "userId",
            u.name as "userName"
    FROM    players p
    JOIN	  users u
      ON	  p.user_id = u.id
    WHERE   p.id = $1
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

// app.get('/api/players/name/:name', async (res, req) => {
//   try{
//     const data = await client.query(`
//     SELECT id, 
//            name,
//            position,
//            year_enrolled as "yearEnrolled",
//            is_transfer as "isTransfer",
//            is_active as "isActive"
//     FROM players
//     WHERE name = $1`,
//     [req.params.name]);
//     res.json(data.rows[0] || null);
//   }
//   catch(err){
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.post('/api/players', async (req, res) => {
  try {
    const player = req.body;

    const data = await client.query(`
      INSERT INTO players (name, position, year_enrolled, is_transfer, is_active, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, position, year_enrolled as "yearEnrolled", is_transfer as "isTransfer", is_active as "isActive", user_id as "userId";
    `,
    [player.name, player.position, player.yearEnrolled, player.isTransfer, player.isActive, player.userId]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.put('/api/players/:id', async (req, res) => {
  try {
    const player = req.body;
    const data = await client.query(`
    UPDATE players
    SET name = $1,
        position = $2,
        year_enrolled = $3,
        is_transfer = $4,
        is_active = $5,
        user_id = $6
    WHERE id = $7
    RETURNING id, name, position, year_enrolled as "yearEnrolled", is_transfer as "isTransfer", is_active as "isActive", user_id as "userId"`,
    [player.name, player.position, player.yearEnrolled, player.isTransfer, player.isActive, player.userId, req.params.id]);
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }});

app.delete('/api/players/:id', async (req, res) => {
  try{
    // const player = req.body;
    const data = await client.query(`
    DELETE FROM players
    WHERE id = $1
    RETURNING id, name, position, year_enrolled as "yearEnrolled", is_transfer as "isTransfer", is_active as "isActive";`,
    [req.params.id]);
    res.json(data.rows);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

export default app;