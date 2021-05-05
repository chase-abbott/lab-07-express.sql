import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';



const request = supertest(app);

describe('CRUD routs', () => {
  afterAll(async () => {
    return client.end();
  });

  beforeAll(() => {
    execSync('npm run recreate-tables');
  });

  // afterAll(async () => {
  //   return client.end();
  // });
  let marcus = {
    id: expect.any(Number),
    name: 'Marcus Mariota',
    position: 'Quarterback',
    yearEnrolled: 2011,
    isTransfer: false,
    isActive: false,
  };

  // let royce = {
  //   id: expect.any(Number),
  //   name: 'Royce Freeman',
  //   position: 'Running Back',
  //   yearEnrolled: 2014,
  //   isTransfer: false,
  //   isActive: false,
  // };

  // let donte = {
  //   id: expect.any(Number),
  //   name: 'Donte Thorton',
  //   position: 'Wide Reciever',
  //   yearEnrolled: 2021,
  //   isTransfer: false,
  //   isActive: true,
  // };

  it('POST /api/players', async () => {
    const response = await request
      .post('/api/players')
      .send(marcus);
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual(marcus);

    marcus = response.body;
  });

  it('PUT /api/players/:id', async () => {
    marcus.isActive = true;
    const response = await request
      .put(`/api/players/${marcus.id}`)
      .send(marcus);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(marcus);
  });
});

describe.skip('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedPlayers = [
    {
      id: expect.any(Number),
      name: 'Marcus Mariota',
      position: 'Quarterback',
      yearEnrolled: 2011,
      isTransfer: false,
      isActive: false,
    },
    {
      id: expect.any(Number),
      name: 'Royce Freeman',
      position: 'Running Back',
      yearEnrolled: 2014,
      isTransfer: false,
      isActive: false,
    },
    {
      id: expect.any(Number),
      name: 'Donte Thorton',
      position: 'Wide Reciever',
      yearEnrolled: 2021,
      isTransfer: false,
      isActive: true,
    },
    {
      id: expect.any(Number),
      name: 'Troy Dye',
      position: 'Linebacker',
      yearEnrolled: 2016,
      isTransfer: false,
      isActive: false,
    },
    {
      id: expect.any(Number),
      name: 'Anthony Brown',
      position: 'Quarterback',
      yearEnrolled: 2020,
      isTransfer: true,
      isActive: true,
    },
    {
      id: expect.any(Number),
      name: 'Mycah Pittman',
      position: 'Wide Reciever',
      yearEnrolled: 2018,
      isTransfer: false,
      isActive: true,
    },
    {
      id: expect.any(Number),
      name: 'Arik Armstead',
      position: 'Defensive End',
      yearEnrolled: 2011,
      isTransfer: false,
      isActive: false,
    },
    {
      id: expect.any(Number),
      name: 'Devon Williams',
      position: 'Wide Reciever',
      yearEnrolled: 2020,
      isTransfer: true,
      isActive: true,
    },
    {
      id: expect.any(Number),
      name: 'Ifo Ekpre-Olomu',
      position: 'Cornerback',
      yearEnrolled: 2010,
      isTransfer: false,
      isActive: false,
    },
    {
      id: expect.any(Number),
      name: 'Joe Walker',
      position: 'Linebacker',
      yearEnrolled: 2012,
      isTransfer: true,
      isActive: false,
    },
    {
      id: expect.any(Number),
      name: 'Travis Dye',
      position: 'Running back',
      yearEnrolled: 2018,
      isTransfer: false,
      isActive: true,
    }
  ];

  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it('GET /api/players', async () => {
    // act - make the request
    const response = await request.get('/api/players');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedPlayers);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  it('GET /api/players/:id', async () => {
    const response = await request.get('/api/players/1');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedPlayers[0]);
  });
});