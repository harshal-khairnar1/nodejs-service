const request = require('supertest');
const {makeApp} = require('../../index');

describe('Integration Tests - Health', () => {
    let server;

    beforeAll(() => {
        server = makeApp();
    });


    it('should return a 200 OK status code for GET request to /health', async () => {
        const response = await request(server).get('/health');
        expect(response.status).toBe(200);
    });
});