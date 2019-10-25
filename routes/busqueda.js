var express = require('express');
const logger = require('../middlewares/logger');
var Animal = require('../models/animal');
var Ubicacion = require('../models/ubicacion');


var app = express();

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    Promise.all([
            buscarAnimales(busqueda, regex),
            buscarUbicaciones(busqueda, regex)
        ])
        .then(respuestas => {
            logger.info('Peticion realizada correctamente');
            res.status(200).json({
                ok: true,
                animales: respuestas[0],
                ubicaciones: respuestas[1]
            });
        });


});

/*
function buscarAnimales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Animal.find({ nombre: regex }, (err, animales) => {

            if (err) {
                logger.error('Metodo: "buscarAnimales", Error: al intentar cargar Animales');
                reject('Error al cargar Animales: ', err);

            } else {
                resolve(animales);
            }

        });
    });

}*/


function buscarAnimales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Animal.find({}, 'nombre name nombreCientifico descripcion ubicacion claseAnimal ordenAnimal activo')
            .or([{ 'nombre': regex }, { 'descripcion': regex }])
            .populate('usuario', 'nombre role')
            .populate('ubicacion', 'nombre descripcion')
            .exec((err, animales) => {
                if (err) {
                    logger.error('Metodo: "buscarAnimales", Error: al intentar cargar Animales');
                    reject('Error al cargar Animales: ', err);

                } else {
                    resolve(animales);
                }
            });
    });

}

function buscarUbicaciones(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Ubicacion.find({ nombre: regex }, 'nombre descripcion planta tipoUbicacion')
            .populate('usuario', 'nombre role')
            .exec((err, ubicaciones) => {
                if (err) {
                    logger.error('Metodo: "buscarUbicaciones", Error: al intentar cargar ubicaciones');
                    reject('Error al cargar ubicaciones: ', err);

                } else {
                    resolve(ubicaciones);
                }
            });
    });

}

module.exports = app;