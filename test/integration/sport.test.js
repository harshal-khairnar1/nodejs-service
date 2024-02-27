const request = require('supertest');
const {makeApp} = require('../../index');
const mysql = require('../../src/lib/mysql');

describe('Integration Tests - Sport', () => {
    let server;
    let news, sports, matches, tours;

    beforeAll(async () => {
        server = makeApp();

        tours = await mysql.query(`select * from mydb.tours`, []);
        matches = await mysql.query(`select * from mydb.matches`, []);
        news = await mysql.query(`select * from mydb.news`, []);
        sports = await mysql.query(`select * from mydb.sports`, []);
    });

    beforeEach(async () => {
        await mysql.query(`delete from mydb.matches`, []);
        await mysql.query(`delete from mydb.tours`, []);
        await mysql.query(`delete from mydb.sports`, []);
        await mysql.query(`delete from mydb.news`, []);
    })


    afterAll(async () => {
        for (const r of news) {
            await mysql.query(`insert into mydb.news values (?, ?, ?, ?, ?)`, [r.id, r.title, r.description, r.tourId, r.matchId])
        }

        for (const r of sports) {
            await mysql.query(`insert into mydb.sports values (?, ?, ?, ?, ?)`, [r.id, r.name, r.status, r.recUpdatedAt, r.createdAt])
        }

        for (const r of tours) {
            await mysql.query(`insert into mydb.tours values (?, ?, ?, ?, ?, ?, ?, ?)`,
                [r.id, r.name, r.sportId, r.status, r.startTime, r.endTime, r.recUpdatedAt, r.createdAt]);
        }

        for (const r of matches) {
            await mysql.query(`insert into mydb.matches values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [r.id, r.name, r.tourId, r.status, r.format, r.startTime, r.endTime, r.recUpdatedAt, r.createdAt]);
        }

        await mysql.close();
    })

    describe("GET /matches endpoint", ()=>{

        it('should return a 200 OK status code with no data', async () => {

            const response = await request(server).get('/sport/tour/match');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({});
        });

        it('should return a 200 OK status code with no data', async () => {

            await mysql.query(`insert ignore into mydb.sports (id, name) values (?, ?)`,[1, 'Cricket']);

            await mysql.query(`insert ignore into mydb.tours (id, name, sportId, startTime, endTime) values (1, 'Indian Premier League, 2023', 1, '2023-04-09 00:00:00', '2023-05-30 00:00:00')`,[]);
            await mysql.query(`insert ignore into mydb.tours (id, name, sportId, startTime, endTime) values (3, 'India Tour of West Indies, 2023', 1, '2023-06-10 00:00:00', '2023-06-29 00:00:00')`,[]);

            await mysql.query(`insert ignore into mydb.matches (id, name, tourId, format, startTime, endTime) values (8, 'IND vs WI', 3, 'ODI', '2023-06-10 10:00:00', '2023-06-10 23:00:00')`,[]);


            const response = await request(server).get('/sport/tour/match');

            expect(response.status).toBe(200);
            expect(response.body).toMatchInlineSnapshot(`
{
  "Cricket": {
    "India Tour of West Indies, 2023": [
      {
        "format": "ODI",
        "matchId": 8,
        "matchName": "IND vs WI",
        "startTime": "2023-06-10T04:30:00.000Z",
      },
    ],
  },
}
`);

            await mysql.query(`delete from mydb.matches`);
            await mysql.query(`delete from mydb.tours`);
            await mysql.query(`delete from mydb.sports`);
        });


    });
});