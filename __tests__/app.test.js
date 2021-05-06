import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API ROUTES', () => {
  
  afterAll(async () => {
    return client.end();
  });

  describe('CRUD routes', () => {

    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');
  
      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Chase',
          email: 'cabbott93@gmail.com',
          password: 'x'
        });
  
      expect(response.status).toBe(200);

      user = response.body;
    });

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
      marcus.userId = user.id;
     
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
      royce.userId = user.id;
      const playerOne = await request
        .post('/api/players')
        .send(royce);

      royce = playerOne.body;

      donte.userId = user.id;
      const playerTwo = await request
        .post('/api/players')
        .send(donte);

      donte = playerTwo.body;


      const response = await request.get('/api/players');

      const expected = [marcus, royce, donte].map(player => {
        return {
          userName: user.name,
          ...player
        };
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining(expected));
    });

    it('GET /api/players/:id', async () => {
      const response = await request.get(`/api/players/${marcus.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...marcus, userName: user.name });
    });

    it('DELETE /api/players/:id', async () => {
      const response = await request 
        .delete(`/api/players/${marcus.id}`);
      const secondResponse = await request.get('/api/players');
      console.log(secondResponse.body);
      expect(response.status).toBe(200);
      expect(secondResponse.body.find(player => player.id === marcus.id)).toBeUndefined();
    });
  });

  describe('Re-seed data', () => {

    beforeAll(() => {
      execSync('npm run setup-db');
    });

    it('GET all players', async () => {
      const response = await request.get('/api/players');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          name: 'Marcus Mariota',
          position: 'Quarterback',
          yearEnrolled: 2011,
          isTransfer: false,
          isActive: false,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Royce Freeman',
          position: 'Running Back',
          yearEnrolled: 2014,
          isTransfer: false,
          isActive: false,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Donte Thorton',
          position: 'Wide Reciever',
          yearEnrolled: 2021,
          isTransfer: false,
          isActive: true,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Troy Dye',
          position: 'Linebacker',
          yearEnrolled: 2016,
          isTransfer: false,
          isActive: false,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Anthony Brown',
          position: 'Quarterback',
          yearEnrolled: 2020,
          isTransfer: true,
          isActive: true,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Mycah Pittman',
          position: 'Wide Reciever',
          yearEnrolled: 2018,
          isTransfer: false,
          isActive: true,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Arik Armstead',
          position: 'Defensive End',
          yearEnrolled: 2011,
          isTransfer: false,
          isActive: false,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Devon Williams',
          position: 'Wide Reciever',
          yearEnrolled: 2020,
          isTransfer: true,
          isActive: true,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Ifo Ekpre-Olomu',
          position: 'Cornerback',
          yearEnrolled: 2010,
          isTransfer: false,
          isActive: false,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Joe Walker',
          position: 'Linebacker',
          yearEnrolled: 2012,
          isTransfer: true,
          isActive: false,
          userId: expect.any(Number),
          userName: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: 'Travis Dye',
          position: 'Running back',
          yearEnrolled: 2018,
          isTransfer: false,
          isActive: true,
          userId: expect.any(Number),
          userName: expect.any(String)
        }
      ]);
    });
  });
});

