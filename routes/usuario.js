var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('./../middlewares/autenticacion');
var Usuario = require('../models/usuario');
const logger = require('./../utils/logger');


// ================================================
// Obtiene todas los usuarios
// ================================================
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email role', (err, usuarios) => {
        if (err) {
            logger.info('Error al obtener usuarios');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al obtener usuarios',
                erros: err
            });

        }
        logger.info('Obtiene usuarios');
        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    });

});


// ================================================
// Crear un usuario
// ================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardada) => {
        if (err) {
            logger.info('Error al crear usuario: ' + err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        usuarioGuardada.password = ':)';
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardada,

        });
        logger.info('usuario creado: ' + usuario.nombre);
    });


});


// ================================================
// Actualizar un Usuario
// ================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            logger.info('Error al buscar usuario con el idX: ' + id);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario con el idX: ' + id,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        if (!usuario) {
            logger.info('Error al buscar usuario con el id: ' + id);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario con el id: ' + id,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.password = bcrypt.hashSync(body.password, 10);
        usuario.role = body.role;


        try {
            usuario.save((err, usuarioGuardada) => {

                if (err) {
                    logger.info('Error al actualizar usuario con el id: ' + id);
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario con el id: ' + id,
                        errors: { message: 'Error al actualizar usuario con ese ID' }

                    });
                }
                usuarioGuardada.password = ':)';
                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardada,
                    mensaje: 'La usuario con el id: ' + id + ' ha sido actualizado correctamente',
                });
                logger.info('usuario con el id: ' + id + ' actualiza correctamente');
            });
        } catch (e) {
            logger.info('Error no contralado: ' + e.message);
        }
    });
});

// ================================================
// Eliminar usuario
// ================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            logger.info('Error al actualizar la usuario ');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            logger.info('No existe un usuario con el id: ' + id);
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una usuario con ese ID',
                errors: { message: 'No existe un usuario con el id: ' + id }
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado,
            mensaje: 'El usuario con el id: ' + id + ' ha sido borrado correctamente',
        });
        logger.info('Usuario con el id: ' + id + ' Borrado correctamente');

    });

});

module.exports = app;