const request = require('supertest');
const app = require('../src/app'); // Importa app

describe('POST /clientes', () => {
  it('debería crear un cliente', async () => {
    const nuevoCliente = {
      nombre_cliente: 'Juan Pérez',
      direccion_cliente: 'Calle Falsa 123',
      celular_cliente: '555-1234'
    };

    const response = await request(app)
      .post('/clientes')
      .send(nuevoCliente) // Envia los datos del nuevo cliente
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('id_cliente'); //ID del cliente
  });
});

