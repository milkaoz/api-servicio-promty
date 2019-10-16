var express = require('express');
var app = express();
var Ubicacion = require('../models/ubicacion');

app.get('/', (req, res, next) => {
    Ubicacion.find({}, (err, ubicaciones) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error ubicaciones!!',
                erros: err
            });
        }
        res.status(200).json({
            ok: true,
            ubicaciones: ubicaciones
        });
    });

});

module.exports = app;