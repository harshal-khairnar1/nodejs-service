const request = require('supertest');
const {makeApp} = require('../../index');
const mysql = require('../../src/lib/mysql');

describe('Integration Tests - Tour', () => {
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

    describe("GET /tours endpoint", ()=>{

        it('should return a 200 OK status code with 0 matches', async () => {

            const response = await request(server).get('/tours');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });

        it('should return a 200 OK status code with 2 matches', async () => {

            await mysql.query(`insert ignore into mydb.sports (id, name) values (?, ?)`,[1, 'Cricket']);
            await mysql.query(`insert ignore into mydb.sports (id, name) values (?, ?)`,[2, 'Football']);

            await mysql.query(`insert into mydb.tours (id, name, sportId, startTime, endTime) values (?, ?, ?, ?, ?)`,[1, 'Indian Premier League, 2023', 1, '2023-04-09 00:00:00', '2023-05-30 00:00:00']);
            await mysql.query(`insert into mydb.tours (id, name, sportId, startTime, endTime) values (?, ?, ?, ?, ?)`,[2, 'India Super League, 2023', 2, '2023-04-21 00:00:00', '2023-06-20 00:00:00']);
            await mysql.query(`insert into mydb.tours (id, name, sportId, startTime, endTime) values (?, ?, ?, ?, ?)`,[3, 'India Tour of West Indies, 2023', 1, '2023-06-10 00:00:00', '2023-06-29 00:00:00']);

            const response = await request(server).get('/tours');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);

            await mysql.query(`delete from mydb.tours`);
            await mysql.query(`delete from mydb.sports`);
        });

    });

    describe("GET /tour/matches endpoint", ()=>{

        it('should return a 500 status code when query param is missing', async () => {

            const response = await request(server).get('/tour/matches');

            expect(response.status).toBe(500);
        });


        it('should return a 200 OK status code with 0 matches', async () => {

            const response = await request(server).get('/tour/matches?name=Indian Premier League, 2023');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });

        it('should return a 200 OK status code with 2 matches', async () => {

            await mysql.query(` insert ignore into mydb.sports (id, name) values (?,?);`,[1, 'Cricket']);

            await mysql.query(`insert ignore into mydb.tours (id, name, sportId, startTime, endTime) values (?, ?, ?, ?, ?)`,[1, 'Indian Premier League, 2023', 1, '2023-04-09 00:00:00', '2023-05-30 00:00:00']);

            await mysql.query(`insert ignore into mydb.matches (name, tourId, format, startTime, endTime) values (?, ?, ?, ?, ?)`,['GT vs RCB', 1, 'T20', '2023-04-09 18:00:00', '2023-04-09 23:00:00']);
            await mysql.query(`insert ignore into mydb.matches (name, tourId, format, startTime, endTime) values (?, ?, ?, ?, ?)`,['CSK vs MI', 1, 'T20', '2023-04-10 18:00:00', '2021-04-10 23:00:00']);

            const response = await request(server).get('/tour/matches?name=Indian Premier League, 2023');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

            await mysql.query(`delete from mydb.matches`);
            await mysql.query(`delete from mydb.tours`);
            await mysql.query(`delete from mydb.sports`);
        });

    });
});