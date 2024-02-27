const request = require('supertest');
const {makeApp} = require('../../index');
const Match = require('../../src/controllers/match');
const {close} = require('../../src/lib/mysql');

jest.mock('../../src/controllers/match');

describe('Unit Tests - match', () => {
    let server;

    beforeAll(() => {
        // const app = makeApp();
        // server = app.listen(3000);
        server = makeApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return a 200 OK status code for GET request to /matches', async () => {

        const resp = [
            {
                "id": 1,
                "name": "GT vs RCB",
                "tourId": 1,
                "status": 1,
                "format": "T20",
                "startTime": "2023-04-09T12:30:00.000Z",
                "endTime": "2023-04-09T17:30:00.000Z",
                "recUpdatedAt": "2024-02-26T08:06:09.000Z",
                "createdAt": "2024-02-26T08:06:09.000Z"
            },
            {
                "id": 2,
                "name": "CSK vs MI",
                "tourId": 1,
                "status": 1,
                "format": "T20",
                "startTime": "2023-04-10T12:30:00.000Z",
                "endTime": "2021-04-10T17:30:00.000Z",
                "recUpdatedAt": "2024-02-26T08:06:09.000Z",
                "createdAt": "2024-02-26T08:06:09.000Z"
            }];

        Match.getAllMatches.mockResolvedValueOnce(resp);

        const response = await request(server).get('/matches');

        expect(Match.getAllMatches).toHaveBeenCalledTimes(1);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resp);
    });
});