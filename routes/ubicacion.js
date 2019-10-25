var express = require('express');
var app = express();
var mdAutenticacion = require('./../middlewares/autenticacion');
var Ubicacion = require('../models/ubicacion');
var usuario = require('../models/animal');
const logger = require('../middlewares/logger');
var SEED = require('./../config/config').SEED;
var config = require('./../config/server');

// ================================================
// Obtiene todas las ubicaciones
// ================================================
app.get('/', (req, res, next) => {
    var desde = +req.query.desde || 0;

    Ubicacion.find({}, 'nombre descripcion planta tipoUbicacion vigente')
        .skip(desde)
        .limit(+config.parametro.paginacionApi)
        .populate('usuario', 'nombre role')
        .exec(
            (err, ubicaciones) => {
                if (err) {
                    logger.info('Error al obtener ubicaciones');
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener ubicaciones',
                        erros: err
                    });
                }
                Ubicacion.count({}, (error, conteo) => {
                    logger.info('Ubicacion: Obtiene todas las ubicaciones');
                    res.status(200).json({
                        ok: true,
                        ubicaciones: ubicaciones
                    });
                });
            });

});

// ================================================
// Crear un ubicacion
// ================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var ubicacion = new Ubicacion({
        nombre: body.nombre,
        descripcion: body.descripcion,
        planta: body.planta,
        tipoUbicacion: body.tipoUbicacion,
        vigente: body.vigente,
    });

    ubicacion.save((err, ubicacionGuardada) => {
        if (err) {
            logger.info('Error al crear ubicacion: ' + err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ubicacion',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            ubicacion: ubicacionGuardada,

        });
        logger.info('Ubicacion: Crea una nueva ubicacion: "' + ubicacion.nombre + '"');
    });


});

// ================================================
// Actualizar un Ubicacion
// ================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Ubicacion.findById(id, (err, ubicacion) => {
        if (err) {
            logger.info('Error al buscar ubicacion con el id: ' + id);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ubicacion con el id: ' + id,
                errors: { message: 'No existe un ubicacion con ese ID' }
            });
        }
        if (!ubicacion) {
            logger.info('Error al buscar ubicacion con el id: ' + id);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar ubicacion con el id: ' + id,
                errors: { message: 'No existe un ubicacion con ese ID' }
            });
        }

        ubicacion.nombre = body.nombre;
        ubicacion.descripcion = body.descripcion;
        ubicacion.planta = body.planta;
        ubicacion.tipoUbicacion = body.tipoUbicacion;
        ubicacion.vigente = body.vigente;
        ubicacion.fechaModificacion = Date.now();

        ubicacion.save((err, ubicacionGuardada) => {
            if (err) {
                logger.info('Error al actualizar ubicacion con el id: ' + id);
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar ubicacion con el id: ' + id,
                    errors: { message: 'Error al actualizar ubicacion con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                ubicacion: ubicacion,
                mensaje: 'Ubicacion: Actualiza una ubicacion: "' + id + '" ha sido actualizado correctamente',
            });
            logger.info('Ubicacion con el id: ' + id + ' actualiza correctamente');
        });
    });
});

// ================================================
// Eliminar usuario
// ================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Ubicacion.findByIdAndRemove(id, (err, ubicacionBorrado) => {
        if (err) {
            logger.info('Error al actualizar la ubicacion ');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar ubicacion',
                errors: err
            });
        }

        if (!ubicacionBorrado) {
            logger.info('No existe un ubicacion con el id: ' + id);
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una ubicacion con ese ID',
                errors: { message: 'No existe un ubicacion con el id: ' + id }
            });
        }

        res.status(201).json({
            ok: true,
            ubicacion: ubicacionBorrado,
            mensaje: 'La ubicacion ' + req.params.nombre + ' con el id: ' + id + ' ha sido borrado correctamente',
        });
        logger.info('Ubicacion: Elimina una ubicacion: "' + id + '" ha sido Elimiado correctamente');

    });

});

module.exports = app;