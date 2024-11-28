const app = require('./app');  // Importa el módulo app 

const puerto = 3000;
app.listen(puerto, () => {
    console.log(`Server running on port ${puerto}`);
});
