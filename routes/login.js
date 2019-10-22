var express = require('express');
var app = express();

var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
const logger = require('./../utils/logger');
const jwt = require('jsonwebtoken');
var SEED = require('./../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            logger.info('Error al buscar usuario: ' + err);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            logger.info('Credenciales incorrectas: ' + err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales login incorrectas - Mail',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            logger.info('Credenciales incorrectas: ' + err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales login incorrectas - Password',
                errors: err
            });
        }

        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 1800 }); //30 munutos

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
        logger.info('Login correcto');
    });


});


module.exports = app;