const request = require('supertest');
const {makeApp} = require('../../index');
const News = require('../../src/controllers/news');

jest.mock('../../src/controllers/news');

describe('Unit Tests - News', () => {
    let server;

    beforeAll(() => {
        server = makeApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("GET request to /news/match/:matchId",  () => {

        it('should return a 200 OK status code', async () => {

            const matchId = '1';
            const resp = [
                {
                    "title": "Mi wins by 5 runs",
                    "description": "some description"
                },
                {
                    "title": "IPL Auction 2024",
                    "description": "some description"
                }
            ];

            News.fetchNewsByMatchId.mockResolvedValueOnce(resp)

            const response = await request(server).get(`/news/match/${matchId}`);

            expect(News.fetchNewsByMatchId).toHaveBeenCalledTimes(1);
            expect(News.fetchNewsByMatchId).toHaveBeenCalledWith(matchId);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(resp);
        });

        it('should return a 500 Internal server error', async () => {

            const matchId = '1';
            const resp = new Error("some-error");

            News.fetchNewsByMatchId.mockRejectedValueOnce(resp)

            const response = await request(server).get(`/news/match/${matchId}`);

            expect(News.fetchNewsByMatchId).toHaveBeenCalledTimes(1);
            expect(News.fetchNewsByMatchId).toHaveBeenCalledWith(matchId);

            expect(response.status).toBe(500);
            expect(response.body).toBeDefined();
            expect(response.body.error).toEqual(resp.message);
        });
    });

    describe("GET request to /news/tour/:tourId", ()=>{

        it('should return a 200 OK status code', async () => {

            const tourId = '1';
            const resp = [
                {
                    "title": "Mi wins by 5 runs",
                    "description": "some description"
                },
                {
                    "title": "IPL Auction 2024",
                    "description": "some description"
                }
            ];

            News.fetchNewsByTourId.mockResolvedValueOnce(resp);

            const response = await request(server).get(`/news/tour/${tourId}`);

            expect(News.fetchNewsByTourId).toHaveBeenCalledTimes(1);
            expect(News.fetchNewsByTourId).toHaveBeenCalledWith(tourId);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(resp);
        });

    });

    describe("GET request to /news/sport/:sportId", ()=>{

        it('should return a 200 OK status code', async () => {

            const sportId = '1';
            const resp = [
                {
                    "title": "Mi wins by 5 runs",
                    "description": "some description"
                },
                {
                    "title": "IPL Auction 2024",
                    "description": "some description"
                }
            ];

            News.fetchNewsBySportId.mockResolvedValueOnce(resp)

            const response = await request(server).get(`/news/sport/${sportId}`);

            expect(News.fetchNewsBySportId).toHaveBeenCalledTimes(1);
            expect(News.fetchNewsBySportId).toHaveBeenCalledWith(sportId);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(resp);
        });

    });

});