import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API ROUTES', () => {
  afterAll(async () => {
    return client.end();
  });

  beforeAll(() => {
    execSync('npm run recreate-tables');
  });

  describe('CRUD routs', () => {

    let marcus = {
      id: expect.any(Number),
      name: 'Marcus Mariota',
      position: 'Quarterback',
      yearEnrolled: 2011,
      isTransfer: false,
      isActive: false,
    };

    let royce = {
      id: expect.any(Number),
      name: 'Royce Freeman',
      position: 'Running Back',
      yearEnrolled: 2014,
      isTransfer: false,
      isActive: false,
    };

    let donte = {
      id: expect.any(Number),
      name: 'Donte Thorton',
      position: 'Wide Reciever',
      yearEnrolled: 2021,
      isTransfer: false,
      isActive: true,
    };

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

    it('GET /api/players', async () => {
      const playerOne = await request
        .post('/api/players')
        .send(royce);
      royce = playerOne.body;
      const playerTwo = await request
        .post('/api/players')
        .send(donte);
      donte = playerTwo.body;

      const response = await request.get('/api/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([marcus, donte, royce]));
    });

    it('GET /api/players/:id', async () => {
      const response = await request.get(`/api/players/${marcus.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(marcus);
    });

    it('DELETE /api/players/:id', async () => {
      const response = await request 
        .delete(`/api/players/${marcus.id}`);
      const secondResponse = await request.get('/api/players');
      expect(response.status).toBe(200);
      expect(secondResponse.body).toEqual(expect.arrayContaining([donte, royce]));
    });
  });
});
