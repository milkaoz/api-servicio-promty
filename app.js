// Inicializacion
var config = require('./config/server');
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const logger = require('./utils/logger');

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
logger.info('stringDB: ' + stringDB);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//conexion base de datos
mongoose.connect(stringDB, { useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    logger.info('Base de datos On line');
});


// Importar Rutas
var ubicacionRoutes = require('./routes/ubicacion');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');




//Injeccion de dependencia
app.use(cors());
app.use('/login', loginRoutes);
app.use('/ubicacion', ubicacionRoutes);
app.use('/usuario', usuarioRoutes);

app.use('/', appRoutes);


//Rutas

// Escuchar peticiones
app.listen(3002, () => {
    logger.info('Express server puerto: 3002 on line');
});