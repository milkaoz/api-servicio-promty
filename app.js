// Inicializacion
var config = require('./config/server');
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const logger = require('./middlewares/logger');
const saslprep = require('saslprep');

var app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Coneccion mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var stringDB = 'mongodb://' + config.database.mongoUser + ':' + saslprep(config.database.mongoPass) + '@' + config.database.mongoHost + ':' + config.database.mongoPort + '/' + config.database.mongoDB;
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
var imagenesRoutes = require('./routes/imagenes');
var uploadRoutes = require('./routes/upload');
var busquedaRoutes = require('./routes/busqueda');
var animalRoutes = require('./routes/animal');
var ubicacionRoutes = require('./routes/ubicacion');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');
var appRoutes = require('./routes/app');


// Server index config
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads')); */


//Injeccion de dependencia
app.use(cors());
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/animal', animalRoutes);
app.use('/ubicacion', ubicacionRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


//Rutas

// Escuchar peticiones
app.listen(3003, () => {
    logger.info('Express server puerto: 3002 on line');
});