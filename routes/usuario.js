var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('./../middlewares/autenticacion');
var Usuario = require('../models/usuario');
const logger = require('../middlewares/logger');
var config = require('./../config/server');


// ================================================
// Obtiene todas los usuarios
// ================================================
app.get('/', (req, res, next) => {

    var desde = +req.query.desde || 0;

    Usuario.find({}, 'nombre email role')
        .skip(desde)
        .limit(+config.parametro.paginacionApi)
        .exec(
            (err, usuarios) => {
                if (err) {
                    logger.error('Error al obtener usuarios');
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener usuarios',
                        erros: err
                    });

                }
                Usuario.count({}, (error, conteo) => {

                    logger.info('Usuario: Obtiene todas los usuarios');
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo,
                    });

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
            logger.error('Error al crear usuario: ' + err);
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
            logger.error('Error al buscar usuario con el idX: ' + id);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario con el idX: ' + id,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        if (!usuario) {
            logger.error('Error al buscar usuario con el id: ' + id);
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
                    logger.error('Error al actualizar usuario con el id: ' + id);
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
                logger.info('Usuario: Actualiza un usuario: "' + id + '" actualizado correctamente');
            });
        } catch (e) {
            logger.error('Error no contralado: ' + e.message);
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
            logger.error('Error al actualizar la usuario ');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            logger.error('No existe un usuario con el id: ' + id);
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
        logger.info('Usuario: Elimina un usuario: "' + id + '" Borrado correctamente');

    });

});

module.exports = app;