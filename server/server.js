require('./config/config');

const mongoose = require('mongoose');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes/ruleta'));

const puerto = process.env.PORT;
const servidorDB = process.env.DB;

// Conecta a la base de datos
mongoose.connect(servidorDB, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err){
        console.log('No se pudo conectar con la base de datos.', err, servidorDB);
    }else{
        console.log('Conexion con la base de datos realizada.');
    }
});

// Inicia el servidor
app.listen(puerto, () => {
    console.log(`Servidor iniciado en el puerto ${puerto}.`);
})