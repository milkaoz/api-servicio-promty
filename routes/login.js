var express = require('express');
var app = express();
const config = require('../config/config');

//Seguridad en claves
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');

//log de transacciones
const logger = require('../middlewares/logger');

// seguridad jwt
const jwt = require('jsonwebtoken');

var SEED = require('./../config/config').SEED;
var CLIENT_ID = require('./../config/config').CLIENT_ID;

// Google 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ================================================
// Autenticacion De Google
// ================================================

// Verificamos la integridad del token generado al momento de autenticarnos
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    logger.info('Autenticacion google exitosa');
    logger.info('payload: ' + payload);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                mensaje: 'Token no valido!!'
            });
            logger.info('Login Google incorrecto');
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            logger.info('Error al buscar usuario: ' + err);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                //usuario no fue atenticado con google
                res.status(400).json({
                    ok: false,
                    mensaje: 'Debe utilizar su autenticacion normal'
                });
                logger.info('Debe utilizar su autenticacion normal');
            } else {
                // usuario autenticado con google
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 1800 }); //30 munutos

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id
                });
                logger.info('Login Normal Correcto');
            }
        } else {
            // el usuario no existe ... hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 1800 }); //30 munutos

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id
                });
            });

        }

    });

    /*  res.status(200).json({
          ok: true,
          mensaje: 'OK!!',
          googleUser: googleUser,
      });
      logger.info('Login Google correcto');*/
});

// ================================================
// Autenticacion normal
// ================================================
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
        logger.info('Login Normal Correcto');
    });


});


module.exports = app;