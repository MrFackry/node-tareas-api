const app = require('./src/app');  // Importa el modulo app 

const puerto = 3000;
app.listen(puerto, () => {
    console.log(`Server running on port ${puerto}`);
});
