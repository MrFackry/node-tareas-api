const request = require('supertest');
const app = require('../src/app'); // Importa tu aplicación

describe('PATCH /clientes/:id_cliente', () => {
  it('debería actualizar parcialmente los datos del cliente con id_cliente 3', async () => {
    // Datos de actualización parcial
    const datosActualizados = {
      nombre_cliente: 'Juan Actualizado'
    };

    const responsePatch = await request(app)
      .patch('/clientes/3') // Enviamos la solicitud PATCH al cliente con id 3
      .send(datosActualizados) // Enviamos los datos de actualización
      .expect(200); // Esperamos un estado 200 si la actualización fue exitosa

    
  });
});
