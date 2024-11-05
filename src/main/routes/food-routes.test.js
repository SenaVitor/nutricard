const request = require('supertest');
const app = require('../config/app');

describe('Food Routes', () => {
    test('Should return 200 when valid credentials are provided', async () => {
        await request(app)
            .get('/api/food')
            .send({
                query: 'rice',
                numberOfResults: 1
            })
            .expect(200);
    });
});
