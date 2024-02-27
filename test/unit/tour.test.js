const request = require('supertest');
const {makeApp} = require('../../index');
const Tour = require('../../src/controllers/tour');


jest.mock('../../src/controllers/tour');

describe('Unit Tests - tour', () => {
    let server;

    beforeAll(() => {
        server = makeApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return a 200 OK status code for GET request to /tours', async () => {

        const resp = [
            {
                "id": 1,
                "name": "Indian Premier League, 2023",
                "sportId": 1,
                "status": 1,
                "startTime": "2023-04-09T00:00:00.000Z",
                "endTime": "2023-05-30T00:00:00.000Z",
                "recUpdatedAt": "2024-02-26T10:34:00.000Z",
                "createdAt": "2024-02-26T10:34:00.000Z"
            },
            {
                "id": 2,
                "name": "India Super League, 2023",
                "sportId": 2,
                "status": 1,
                "startTime": "2023-04-21T00:00:00.000Z",
                "endTime": "2023-06-20T00:00:00.000Z",
                "recUpdatedAt": "2024-02-26T10:34:00.000Z",
                "createdAt": "2024-02-26T10:34:00.000Z"
            }];

        Tour.getAllTours.mockResolvedValueOnce(resp);

        const response = await request(server).get('/tours');

        expect(Tour.getAllTours).toHaveBeenCalledTimes(1);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resp);

    });

    it('should return a 200 OK status code for GET request to /tour/matches', async () => {

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

        Tour.getMatchesByTourName.mockResolvedValueOnce(resp);

        const response = await request(server).get('/tour/matches');

        expect(Tour.getMatchesByTourName).toHaveBeenCalledTimes(1);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resp);
    });
});