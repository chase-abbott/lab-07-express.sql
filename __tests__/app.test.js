import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';


const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedPlayers = [
    {
      id: 1,
      name: 'Marcus Mariota',
      position: 'Quarterback',
      yearEnrolled: 2011,
      isTransfer: false,
      isActive: false,
    },
    {
      id: 2,
      name: 'Royce Freeman',
      position: 'Running Back',
      yearEnrolled: 2014,
      isTransfer: false,
      isActive: false,
    },
    {
      id: 3,
      name: 'Donte Thorton',
      position: 'Wide Reciever',
      yearEnrolled: 2021,
      isTransfer: false,
      isActive: true,
    },
    {
      id: 4,
      name: 'Troy Dye',
      position: 'Linebacker',
      yearEnrolled: 2016,
      isTransfer: false,
      isActive: false,
    },
    {
      id: 5,
      name: 'Anthony Brown',
      position: 'Quarterback',
      yearEnrolled: 2020,
      isTransfer: true,
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
  test('GET /api/players/:id', async () => {
    const response = await request.get('/api/players/1');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedPlayers[0]);
  });
});