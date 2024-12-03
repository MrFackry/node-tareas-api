const request = require('supertest');
const app = require('../src/app'); // Importa tu aplicación

describe('DELETE /clientes/:id_cliente', () => {
  it('debería eliminar un cliente con id_cliente 1', async () => {
    const responseDelete = await request(app)
      .delete('/clientes/3')  // Enviamos la solicitud DELETE para el cliente con id 1
      .expect(200);  // Esperamos que se elimine correctamente

    expect(responseDelete.text).toBe('Cliente eliminado exitosamente');

  });
})