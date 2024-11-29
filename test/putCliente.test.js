const request = require('supertest');
const app = require('../src/app'); // Importa app

describe('PUT /clientes/:id_cliente', () => {
  it('debería actulizar un clientes', async () => {
    const cliente = {
        nombre_cliente: 'Juan Pérez',
        direccion_cliente: 'Calle Falsa 123',
        celular_cliente: '555-1234'
      };

    const response = await request(app)
      .put('/clientes/2')
      .send(cliente) // Envia los datos del cliente
      .expect('Content-Type', /json/)
      .expect(200);

      expect(response.body).toBeInstanceOf(Object);
  });
});
