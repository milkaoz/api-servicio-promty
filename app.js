// Inicializacion
var config = require('./config/server');
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Coneccion mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var stringDB = 'mongodb://' + config.database.mongoUser + ':' + config.database.mongoPass + '@' + config.database.mongoHost + ':' + config.database.mongoPort + '/' + config.database.mongoDB;
console.log('stringDB: ' + stringDB);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//conexion base de datos
mongoose.connection.openUri(stringDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'On line');
});


// Importar Rutas
var ubicacionRoutes = require('./routes/ubicacion');
var appRoutes = require('./routes/app');


//Injeccion de dependencia
app.use(cors());
app.use('/ubicacion', ubicacionRoutes);
app.use('/', appRoutes);


//Rutas

// Escuchar peticiones
app.listen(3002, () => {
    console.log('Express server puerto: 3002 on line');
});