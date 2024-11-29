const request = require('supertest');
const app = require('../src/app'); // Importa app

describe('GET /clientes', () => {
  it('debería devolver una lista de clientes', async () => {
    const response = await request(app)
      .get('/clientes')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
