var express = require('express');
var app = express();
var mdAutenticacion = require('./../middlewares/autenticacion');
var Animal = require('../models/animal');
var usuario = require('../models/usuario');
const logger = require('../middlewares/logger');
var SEED = require('./../config/config').SEED;
var config = require('./../config/server');

// ================================================
// Obtiene todas los animales
// ================================================
app.get('/', (req, res, next) => {
    var desde = +req.query.desde || 0;

    Animal.find({}, 'nombre name nombreCientifico descripcion ubicacion claseAnimal ordenAnimal activo')
        .skip(desde)
        .limit(+config.parametro.paginacionApi)
        .populate('usuario', 'nombre role')
        .populate('ubicacion', 'nombre descripcion planta tipoUbicacion vigente')
        .exec(
            (err, animales) => {
                if (err) {
                    logger.error('Error al obtener animales');
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener animales',
                        erros: err
                    });
                }
                Animal.count({}, (error, conteo) => {
                    logger.info('Animal: Obtiene todas los animales');
                    res.status(200).json({
                        ok: true,
                        animales: animales,
                        total: conteo,
                    });
                });
            });
});

// ================================================
// Crear un animal
// ================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var animal = new Animal({
        nombre: body.nombre,
        name: body.name,
        nombreCientifico: body.nombreCientifico,
        descripcion: body.descripcion,
        img: body.img,
        ubicacion: body.ubicacion,
        claseAnimal: body.claseAnimal,
        ordenAnimal: body.ordenAnimal,
        activo: body.activo,
        usuario: req.usuario._id
    });

    animal.save((err, animalGuardada) => {
        if (err) {
            logger.error('Error al crear animal: ' + err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear animal',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            animal: animalGuardada,

        });
        logger.info('Animal: Crea un nuevo animal: "' + animal.nombre + '"');
    });


});

// ================================================
// Actualizar un animal
// ================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Animal.findById(id, (err, animal) => {
        if (err) {
            logger.error('Error al buscar animal con el id: ' + id);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar animal con el id: ' + id,
                errors: { message: 'No existe un animal con ese ID' }
            });
        }
        if (!animal) {
            logger.error('Error al buscar animal con el id: ' + id);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar animal con el id: ' + id,
                errors: { message: 'No existe un animal con ese ID' }
            });
        }

        animal.nombre = body.nombre;
        animal.descripcion = body.descripcion;
        animal.planta = body.planta;
        animal.tipoanimal = body.tipoanimal;
        animal.vigente = body.vigente;
        animal.fechaModificacion = Date.now();

        animal.save((err, animalGuardada) => {
            if (err) {
                logger.error('Error al actualizar animal con el id: ' + id);
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar animal con el id: ' + id,
                    errors: { message: 'Error al actualizar animal con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                animal: animalGuardada,
                mensaje: 'La animal con el id: ' + id + ' ha sido actualizado correctamente',
            });
            logger.info('Animal: Actualiza un animal: "' + id + '" actualizado correctamente');
        });
    });
});

// ================================================
// Eliminar animal
// ================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Animal.findByIdAndRemove(id, (err, animalBorrado) => {
        if (err) {
            logger.error('Error al actualizar el animal ');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar animal',
                errors: err
            });
        }

        if (!animalBorrado) {
            logger.error('No existe un animal con el id: ' + id);
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una animal con ese ID',
                errors: { message: 'No existe un animal con el id: ' + id }
            });
        }

        res.status(201).json({
            ok: true,
            animal: animalBorrado,
            mensaje: 'El animal con el id: ' + id + ' ha sido borrado correctamente',
        });
        logger.info('Usuario: Elimina un usuario: "' + id + '" borrado correctamente');

    });

});

module.exports = app;