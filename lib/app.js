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
app.get('/api/players', async (req, res) => {
  // use SQL query to get data...
  try {
    
    const data = await client.query(`
      SELECT  id,
              name,
              position,
              year_enrolled as "yearEnrolled",
              is_transfer as "isTransfer",
              is_active as "isActive"
      FROM    players;
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
      SELECT  id,
              name,
              position,
              year_enrolled as "yearEnrolled",
              is_transfer as "isTransfer",
              is_active as "isActive"
      FROM    players
      WHERE   id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.post('/api/players', async (req, res) => {
  try {
    const player = req.body;

    const data = await client.query(`
      INSERT INTO players (name, position, year_enrolled, is_transfer, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, position, year_enrolled as "yearEnrolled", is_transfer as "isTransfer", is_active as "isActive";
    `,
    [player.name, player.position, player.yearEnrolled, player.isTransfer, player.isActive]);

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
        is_active = $5
    WHERE id = $6
    RETURNING id, name, position, year_enrolled as "yearEnrolled", is_transfer as "isTransfer", is_active as "isActive"`,
    [player.name, player.position, player.yearEnrolled, player.isTransfer, player.isActive, req.params.id]);
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }});

export default app;