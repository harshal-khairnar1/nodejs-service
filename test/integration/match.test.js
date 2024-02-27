const request = require('supertest');
const {makeApp} = require('../../index');
const mysql = require('../../src/lib/mysql');

describe('Integration Tests - Match', () => {
    let server;
    let matches, tours;

    beforeAll(async () => {
        server = makeApp();

        matches = await mysql.query(`select * from mydb.matches`, []);
        tours = await mysql.query(`select * from mydb.tours`, []);
    });

    beforeEach(async () => {
        await mysql.query(`delete from mydb.matches`,[]);
    })


    afterAll(async () => {
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

        it('should return a 200 OK status code with 0 matches', async () => {

            const response = await request(server).get('/matches');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });

        it('should return a 200 OK status code with 2 matches', async () => {

            await mysql.query(`insert ignore into mydb.tours (id, name, sportId, startTime, endTime) values (1, 'Indian Premier League, 2023', 1, '2023-04-09 00:00:00', '2023-05-30 00:00:00')`,[]);

            await mysql.query(`insert into mydb.matches (id, name, tourId, format, startTime, endTime) values (?, ?, ?, ?, ?, ?)`,[1,'GT vs RCB', 1, 'T20', '2023-04-09 18:00:00', '2023-04-09 23:00:00']);
            await mysql.query(`insert into mydb.matches (id, name, tourId, format, startTime, endTime) values (?, ?, ?, ?, ?, ?)`,[2,'CSK vs MI', 1, 'T20', '2023-04-10 18:00:00', '2021-04-10 23:00:00']);

            const response = await request(server).get('/matches');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

            await mysql.query(`delete from mydb.matches`,[]);
            await mysql.query(`delete from mydb.tours`,[]);
        });

    });
});