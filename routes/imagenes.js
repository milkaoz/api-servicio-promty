var express = require('express');
const logger = require('../middlewares/logger');
const path = require('path');
const fs = require('fs');
var app = express();

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImage = path.resolve(__dirname, `../uploads/${ tipo}/${img}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
    logger.info('Peticion realizada correctamente');
});

module.exports = app;