const request = require('supertest');
const { makeApp } = require('../../index');
const Sport = require('../../src/controllers/sport');

jest.mock('../../src/controllers/sport');

describe('Unit Tests - Sport', () => {
    let server;

    beforeAll(() => {
        server = makeApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return a 200 OK status code for GET request to /sport/tour/match', async () => {

        const resp = {
            "Cricket": {
                "Indian Premier League, 2023": [
                    {
                        "matchName": "GT vs RCB",
                        "matchId": 1,
                        "format": "T20",
                        "startTime": "2023-04-09T12:30:00.000Z"
                    },
                    {
                        "matchName": "CSK vs MI",
                        "matchId": 2,
                        "format": "T20",
                        "startTime": "2023-04-10T12:30:00.000Z"
                    },
                    {
                        "matchName": "LSG vs KXIP",
                        "matchId": 3,
                        "format": "T20",
                        "startTime": "2023-04-11T12:30:00.000Z"
                    },
                    {
                        "matchName": "RR vs SRH",
                        "matchId": 4,
                        "format": "T20",
                        "startTime": "2023-04-12T12:30:00.000Z"
                    }
                ],
                "India Tour of West Indies, 2023": [
                    {
                        "matchName": "IND vs WI",
                        "matchId": 8,
                        "format": "ODI",
                        "startTime": "2023-06-10T04:30:00.000Z"
                    },
                    {
                        "matchName": "IND vs WI",
                        "matchId": 9,
                        "format": "ODI",
                        "startTime": "2023-06-12T04:30:00.000Z"
                    },
                    {
                        "matchName": "IND vs WI",
                        "matchId": 10,
                        "format": "ODI",
                        "startTime": "2023-06-14T04:30:00.000Z"
                    }
                ]
            },
            "Football": {
                "India Super League, 2023": [
                    {
                        "matchName": "BLR vs BEN",
                        "matchId": 5,
                        "format": "soccer",
                        "startTime": "2023-04-29T12:30:00.000Z"
                    },
                    {
                        "matchName": "ATK vs MCFC",
                        "matchId": 6,
                        "format": "soccer",
                        "startTime": "2023-04-21T12:30:00.000Z"
                    },
                    {
                        "matchName": "KER vs JFC",
                        "matchId": 7,
                        "format": "soccer",
                        "startTime": "2023-04-22T12:30:00.000Z"
                    }
                ],
                "English Premier League, 2022": [
                    {
                        "matchName": "KER vs JFC",
                        "matchId": 11,
                        "format": "soccer",
                        "startTime": "2022-04-09T12:30:00.000Z"
                    }
                ]
            }
        };

        Sport.getAllSportsToursAndMatches.mockResolvedValueOnce(resp);

        const response = await request(server).get('/sport/tour/match');

        expect(Sport.getAllSportsToursAndMatches).toHaveBeenCalledTimes(1);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(resp);
    });
});