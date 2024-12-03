const request = require('supertest');
const app = require('../src/app'); // Importa app

describe('GET /clientes/:id', () => {
  it('debería devolver un cliente', async () => {
    const response = await request(app)
      .get('/clientes/3') 
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Object);
  });
});

