import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser"; // Asegúrate de tener body-parser instalado

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
    const newId = bd.clientes.length ? bd.clientes[bd.clientes.length - 1].id_cliente + 1 : 1; 
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
        id_cliente,                   // Asegura que el id_cliente sea consistente
    };

    bd.clientes[clienteIndex] = actulizarCliente;
    writeDB(bd); // Guarda los cambios en el archivo

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
//TODO METODOS PATCH PARA CLIENTES PRODUCTOS Y CARRITO

//TODO METODOS DELETE PARA CLIENTES PRODUCTOS Y CARRITO

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
