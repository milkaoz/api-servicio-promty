var express = require('express');
var app = express();
var Ubicacion = require('../models/ubicacion');
const logger = require('./../utils/logger');


// ================================================
// Obtiene todas las ubicaciones
// ================================================
app.get('/', (req, res, next) => {
    Ubicacion.find({}, (err, ubicaciones) => {
        if (err) {
            logger.info('Error al obtener ubicaciones');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al obtener ubicaciones',
                erros: err
            });

        }
        logger.info('Obtiene ubicaciones');
        res.status(200).json({
            ok: true,
            ubicaciones: ubicaciones
        });
    });

});


// ================================================
// Crear un ubicacion
// ================================================
app.post('/', (req, res) => {

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
        logger.info('usuario creado: ' + ubicacion.nombre);
    });


});

// ================================================
// Actualizar un Ubicacion
// ================================================

app.put('/:id', (req, res) => {
    logger.info('Inicia Put ubicacion');
    var id = req.params.id;
    var body = req.body;

    Ubicacion.findById(id, (err, ubicacion) => {

        if (err) {
            logger.info('Error al intentar buscar la ubicacion: ' + err);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ubicacion',
                errors: err
            });
        }
        if (!ubicacion) {
            if (err) {
                logger.info('La ubicacion con el id: ' + id + 'no existe ');
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La ubicacion con el id: ' + id + 'no existe',
                    errors: { message: 'No existe un ubicacion con ese ID' }
                });
            }
        }

        ubicacion.nombre = body.nombre;
        ubicacion.descripcion = body.descripcion;
        ubicacion.planta = body.planta;
        ubicacion.tipoUbicacion = body.tipoUbicacion;

        ubicacion.save((err, ubicacionGuardado) => {
            if (err) {
                logger.info('Error al actualizar la ubicacion ');
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el ubicacion',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                mensaje: 'Actualizacion ejecutada correctamente'
            });
            logger.info('Actualizacion ejecutada correctamente ');
        });



    });

});



// ================================================
// Eliminar usuario
// ================================================

app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Ubicacion.findByIdAndRemove(id, (err, ubicacionBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar ubicacion',
                errors: err
            });
        }

        if (!ubicacionBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una ubicacion con ese ID',
                errors: { message: 'No existe un ubicacion con el id: ' + id }
            });
        }

        res.status(201).json({
            ok: true,
            ubicacion: ubicacionBorrado
        });

    });

});

module.exports = app;