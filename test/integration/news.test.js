const request = require('supertest');
const {makeApp} = require('../../index');
const mysql = require("../../src/lib/mysql");

describe('Integration Tests - News', () => {
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

    describe("PUT /news", () => {
        it('should return a 200 OK status code', async () => {

            const body = {
                "title": "CSK won by 22 runs",
                "description": "some description for CSK",
                "tourId": 1
            }

            const response = await request(server).put('/news').send(body)
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);


            const res = await mysql.query(`select * from mydb.news where title=?`,['CSK won by 22 runs']);
            expect(res).toBeDefined();
            expect(res[0].title).toEqual(body.title);
            expect(res[0].description).toEqual(body.description);
            expect(res[0].tourId).toEqual(body.tourId);

            await mysql.query(`delete from mydb.news;`,[]);
        });
    })



    describe("GET /news/match/{matchId} endpoint",()=>{
        it('should return a 200 OK status code', async () => {

            const matchId = 2;

            const resp={ title: 'Mi wins by 5 runs', description: 'some description' };
            await mysql.query(`insert ignore into mydb.news (title, description, tourId, matchId) values (?, ?, ?, ? )`,['Mi wins by 5 runs', 'some description', null, matchId]);

            const response = await request(server).get(`/news/match/${matchId}`);

            expect(response.status).toBe(200);

            expect(response.body).toBeDefined();
            expect(response.body).toContainEqual(resp);

            await mysql.query(`delete from mydb.news`);
        });
    })

    describe("GET /news/tour/{tourId} endpoint",()=>{
        it('should return a 200 OK status code', async () => {

            const tourId = 1;

            await mysql.query(`insert ignore into mydb.news (title, description, tourId, matchId) values (?, ?, ?, ? )`,['IPL Auction 2024', 'some description', tourId, null]);
            await mysql.query(`insert ignore into mydb.news (title, description, tourId, matchId) values (?, ?, ?, ? )`,['IPL starts 22 March', 'some description', tourId, null]);

            const response = await request(server).get(`/news/tour/${tourId}`);
            expect(response.status).toBe(200);

            await mysql.query(`delete from mydb.news`);
        });
    })

    describe("GET /news/sport/{sportId} endpoint",()=>{
        it('should return a 200 OK status code', async () => {

            const sportId= 1;

            await mysql.query(`insert ignore into mydb.sports (id, name) values (?, ?)`,[1, 'Cricket']);

            await mysql.query(`insert ignore into mydb.tours (id, name, sportId, startTime, endTime) values (1, 'Indian Premier League, 2023', 1, '2023-04-09 00:00:00', '2023-05-30 00:00:00')`,[]);
            await mysql.query(`insert ignore into mydb.tours (id, name, sportId, startTime, endTime) values (3, 'India Tour of West Indies, 2023', 1, '2023-06-10 00:00:00', '2023-06-29 00:00:00')`,[]);

            await mysql.query(`insert ignore into mydb.matches (id, name, tourId, format, startTime, endTime) values (8, 'IND vs WI', 3, 'ODI', '2023-06-10 10:00:00', '2023-06-10 23:00:00')`,[]);

            await mysql.query(`insert ignore into mydb.news (title, description, tourId, matchId) values (?, ?, ?, ?);`,['IPL Auction 2024', 'some description', 1, null]);
            await mysql.query(`insert ignore into mydb.news (title, description, tourId, matchId) values (?, ?, ?, ?);`,['IPL starts 22 March', 'some description', 1, null]);
            await mysql.query(`insert ignore into mydb.news (title, description, tourId, matchId) values (?, ?, ?, ?);`,['IND win by 6 wickets against WI', 'some description', null, 8]);
            await mysql.query(`insert ignore into mydb.news (title, description, tourId, matchId) values (?, ?, ?, ?);`,['IND squad against WI', 'some description', 3, null]);


            const response = await request(server).get(`/news/sport/${sportId}`);
            expect(response.status).toBe(200);

            await mysql.query(`delete from mydb.news`);
            await mysql.query(`delete from mydb.matches`);
            await mysql.query(`delete from mydb.tours`);
            await mysql.query(`delete from mydb.sports`);
        });
    })



});