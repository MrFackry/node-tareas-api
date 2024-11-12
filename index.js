import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser"; // Asegúrate de tener body-parser instalado
import { request } from "http";

const app = express();
const puerto = 3000;
app.use(express.json());

//conexion con db.json
const dbPath = path.join(process.cwd(), "bd.json");

// Asegúra de usar el middleware para poder leer req.body
app.use(bodyParser.json());

//metodo para leer la db.json
function readDB() {
    try {
        const data = fs.readFileSync(dbPath);
        return JSON.parse(data);
    } catch (error) {
        console.log("Error al intentar leer el archivo:", error);
        return { clientes: [], productos: [], carrito: [] };
    }
}

// constante global para no tener que crearla local en todas las funciones
const bd = readDB();

//metodo para escribir en bd.json
function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al intentar escribir en el archivo:", error);
    }
}

//metodo get para clientes
app.get('/clientes', (req, res) => {
    res.json(bd.clientes);
});


app.get('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cliente = bd.clientes.find(est => est.id_cliente === id);
    if (cliente) {
        res.json(cliente); 
    } else {
        res.status(404).send("cliente no encontrado");
    }
});

//metodo get para productos
app.get('/productos', (req, res) => {
    res.json(bd.productos);
});


app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = bd.productos.find(est => est.id === id); 
    if (producto) {
        res.json(producto); 
    } else {
        res.status(404).send("producto no encontrado");
    }
});

//metodo get para carrito
app.get('/carrito', (req, res) => {
    res.json(bd.carrito);
});

app.get('/carrito/:id_cliente', (req, res) => {
    const id_cliente = parseInt(req.params.id_cliente);
    const carrito = bd.carrito.find(est => est.id_cliente === id_cliente);
    if (carrito) {
        res.json(carrito); 
    } else {
        res.status(404).send("carrito no encontrado");
    }
});

//metodo post clientes
app.post('/clientes', (req, res) => {
    const { nombre_cliente, direccion_cliente, celular_cliente } = req.body; 
    const newId = bd.clientes.length ? bd.clientes[bd.clientes.length - 1].id + 1 : 1; 
    const nuevo_cliente = { id: newId, nombre_cliente, direccion_cliente, celular_cliente };
    bd.clientes.push(nuevo_cliente); 
    writeDB(bd);
    res.status(201).json(nuevo_cliente);
});

//metodos post productos
app.post('/productos', (req, res) => {
    const { nombre, linea, precio } = req.body; 
    const newId = bd.productos.length ? bd.productos[bd.productos.length - 1].id + 1 : 1;
    const nuevo_producto = { id: newId, nombre, linea, precio };
    bd.productos.push(nuevo_producto); 
    writeDB(bd);
    res.status(201).json(nuevo_producto);
});

//metodos post carrito

app.post('/carrito', (req, res) => {
    const { id_cliente, productos } = req.body; 
    const nuevo_carrito = { id_cliente, productos };
    bd.carrito.push(nuevo_carrito); 
    writeDB(bd);
    res.status(201).json(nuevo_carrito);
});

//METODOS PUT PARA CLIENTES PRODUCTOS Y CARRITO

app.put('/clientes/:id_cliente', (req, res) => {
    const body = req.body;
    const id_cliente = parseInt(req.params.id_cliente);
    const clienteIndex = bd.clientes.findIndex(est => est.id_cliente === id_cliente);
    
    if (clienteIndex === -1) {
        return res.status(404).send("cliente no encontrado");
    }

    const actulizarCliente = {
        ...bd.clientes[clienteIndex], // Mantiene los datos existentes
        ...body,                      // Actualiza solo los campos proporcionados en el body
        id_cliente,                   
    };

    bd.clientes[clienteIndex] = actulizarCliente;
    writeDB(bd); 

    return res.status(200).json(actulizarCliente);
});


app.put('/productos/:id', (req,res)=> {
    const body = req.body
    const id = parseInt(req.params.id);
    const producto = bd.productos.findIndex(est => est.id === id); 
    if (producto===-1) {
        res.status(404).send("producto no encontrado");
    } const actulizarProducto = {
        ...bd.productos[producto], 
        ...body,                      
        id,                   
    };

    bd.productos[producto] = actulizarProducto;
    writeDB(bd); // Guarda los cambios en el archivo

    return res.status(200).json(actulizarProducto);
})

app.put('/carrito/:id_cliente', (req, res) => {
    const body = req.body;
    const id_cliente = parseInt(req.params.id_cliente);
    const carrito = bd.carrito.findIndex(est => est.id_cliente === id_cliente);
    if (carrito===-1) {
        res.status(404).send("carrito no encontrado");
    } const actulizarCarrito = {
        ...bd.carrito[carrito], 
        ...body,                      
        id_cliente,                   
    };
    bd.carrito[carrito] = actulizarCarrito;
    writeDB(bd);
    return res.status(200).json(actulizarCarrito);
})
//run server comman
"npm run dev"


//metodos prueba

app.get("/", (req, res) => {
    res.send("hola mundos");
})
//funcion call back
app.listen(puerto, () => {
    console.log("hola mundo pruebas");
});

// METODO PATCH CLIENTES
app.patch('/clientes/:id_cliente', (req, res) => {
    const id_cliente = parseInt(req.params.id_cliente); // obtener el id de la URL
    const informacion = req.body; // obtener los datos del cuerpo de la solicitud

    const clienteIndex = bd.clientes.findIndex(est => est.id_cliente === id_cliente);

    if(clienteIndex < 0){
        return res.status(404).send("No se encontro el cliente");
    }
    const cliente_modificar = bd.clientes[clienteIndex];
    Object.assign(cliente_modificar, informacion);
    //assign es un metodo que permite modificar aquellos argumentos que le pasemos
    // Escribir los cambios en la base de datos
    writeDB(bd);

    // Devolver el cliente actualizado
    res.status(200).json(cliente_modificar);
});

// METODO PATCH PRODUCTOS

app.patch('/productos/:id', (req,res)=> {
    const body = req.body
    const id = parseInt(req.params.id);

    const productIndex = bd.productos.findIndex(est => est.id === id);

    if(productIndex < 0){
        return res.status(404).send("No se encontro el producto");
    }
    const producto_modificar = bd.productos[productIndex];
    Object.assign(producto_modificar, body);
    //assign es un metodo que permite modificar aquellos argumentos que le pasemos
    // Escribir los cambios en la base de datos
    writeDB(bd);

    // Devolver el cliente actualizado
    res.status(200).json(producto_modificar);
});

//METODO PATCH PARA CARRITO

app.patch('/carrito/:id_cliente/:id_producto', (req, res) => {
    const body = req.body;
    const id_cliente = parseInt(req.params.id_cliente);
    const id_producto = parseInt(req.params.id_producto);

    const carrito = bd.carrito.findIndex(est => est.id_cliente === id_cliente);

    if (carrito < 0) {
        return res.status(404).send("No se encontró el carrito asociado");
    }

    const carrito_modificar = bd.carrito[carrito];
    const producto_modificar = carrito_modificar.productos.find(prod => prod.id_producto === id_producto);

    if (!producto_modificar) {
        return res.status(404).send("No se encontró el producto en el carrito");
    }

    // Modificar el producto con los datos del cuerpo de la solicitud
    Object.assign(producto_modificar, body);

    // Escribir los cambios en la base de datos
    writeDB(bd);

    // Devolver el producto actualizado
    res.status(200).json(producto_modificar);
});


//METODO DELETE PARA CLIENTES

app.delete('/clientes/:id_cliente', (req, res) => {
    const id_cliente = parseInt(req.params.id_cliente);
    const clienteIndex = bd.clientes.findIndex(c => c.id_cliente === id_cliente);
    if (clienteIndex === -1) {
        return res.status(404).send("Cliente no encontrado");
    }
    //metodo splice se le pasa el index de que s equiere que se borre 
    bd.clientes.splice(clienteIndex, 1);
    writeDB(bd);
    res.status(200).send("Cliente eliminado exitosamente");
});

//METODO DELETE PARA PRODUCTOS
app.delete('/productos/:id', (req,res)=> {
    const id = parseInt(req.params.id);
    const productIndex = bd.productos.findIndex(est => est.id === id);

    if(productIndex ===-1){
        return res.status(404).send("Producto no encontrado");

    }
    bd.productos.splice(productIndex,1)
    writeDB(bd);
    res.status(200).send("Producto eliminado exitosamente");
})

//METODO DELETE PARA CARRITO
app.delete('/carrito/:id_cliente', (req, res) => {
    //  Esta es la función que define un endpoint para manejar solicitudes DELETE
    const id_cliente = parseInt(req.params.id_cliente); // params hace referencia a los parámetros de ruta que se extraen de la URL
    const carrito = bd.carrito.findIndex(est => est.id_cliente === id_cliente);
    //findIndex  función de los arrays en JavaScript que busca el índice del primer elemento que cumpla con una condición dada

    if (carrito === -1){
        return res.status(404).send("Carrito no encontrado")
    }
    bd.carrito.splice(carrito,1) //metodo splice se le pasa el index de que se quiere que se borre 

    writeDB(bd); // writeDB() toma la base de datos actualizada (bd) y la escribe de nuevo en el archivo bd.json.
    res.status(200).send("Carrito eliminado exitosamente"); // Se establece el código de estado HTTP 200, que indica que la solicitud fue procesada correctamente.
})
