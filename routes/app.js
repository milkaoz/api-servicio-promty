var express = require('express');
const logger = require('../middlewares/logger');

var app = express();

app.get('/', (req, res, next) => {
    logger.info('Peticion realizada correctamente');
    res.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente"
    });
});

module.exports = app;