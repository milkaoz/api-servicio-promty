// Inicializacion
var config = require('./config/server');
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();

// Coneccion mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var stringDB = 'mongodb://' + config.database.mongoUser + ':' + config.database.mongoPass + '@' + config.database.mongoHost + ':' + config.database.mongoPort + '/' + config.database.mongoDB;
console.log('stringDB: ' + stringDB);

//Injeccion de dependencia
app.use(cors());

//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3001, () => {
    console.log('Express server puerto: 3001 on line');
});