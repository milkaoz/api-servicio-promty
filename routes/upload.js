var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Animal = require('../models/animal');
var Ubicacion = require('../models/ubicacion');
var Usuario = require('../models/usuario');
var logger = require('../middlewares/logger');



// middleware 
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion
    var tiposValidos = ['ubicaciones', 'animales', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        logger.error('Tipo de coleccion no valida');
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            erros: { message: 'Tipo de coleccion no valida' },
        });
    }

    if (!req.files) {
        logger.error('Debe seleccionar una imagen');
        return res.status(400).json({
            ok: false,
            mensaje: 'Debe seleccionar una imagen',
            erros: { message: 'Debe seleccionar una imagen' },
        });
    }
    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1].toLowerCase();


    //solo estas extension aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //busca si existe en la coleccion la extension del archivo
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        logger.error('Extension no valida');
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            erros: { message: 'Las extension valida son: ' + extensionesValidas.join(', ') },
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${new Date().getMilliseconds() }.${extensionArchivo}`;
    //logger.info('nombreArchivoA: ' + nombreArchivo);
    //mover el archivo
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;


    archivo.mv(path, err => {
        if (err) {
            logger.error('Error al mover archivo');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                erros: err,
            });
        }
        //logger.info('nombreArchivoB: ' + nombreArchivo);
        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'ubicaciones') {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            Ubicacion.findById(id, (err, ubicacion) => {
                if (!ubicacion) {
                    logger.error('El ubicacion con el id :' + id + 'no existe');
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'El ubicacion con el id :' + id + 'no existe',
                        errors: { message: 'El ubicacion con el id :' + id + 'no existe' }
                    });
                }
                if (!ubicacion.img) {
                    logger.info('ubicacion no tiene imagen');
                }
                // define path de una imagen anterior
                var pathViejo = './uploads/ubicaciones/' + ubicacion.img;
                // si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo, (err) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error al intentar eliminar la imágen',
                                errors: err
                            });
                        }
                    });
                }
                logger.info('nombreArchivoC: ' + nombreArchivo);
                ubicacion.img = nombreArchivo;
                ubicacion.fechaModificacion = Date.now();
                ubicacion.save((err, ubicacionActualizado) => {

                    if (err) {
                        logger.error('Error al guardar archivo');
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar archivo',
                            erros: err,
                        });
                    }

                    logger.info('Archivo almacenado y movido correctamente' + ubicacionActualizado);
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Archivo almacenado y movido correctamente',
                        ubicacion: ubicacionActualizado
                    });

                });

            });
        }

    }
    if (tipo === 'animales') {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            Animal.findById(id, (err, animal) => {
                if (!animal) {
                    logger.error('El animal con el id :' + id + 'no existe');
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'El animal con el id :' + id + 'no existe',
                        errors: { message: 'El animal con el id :' + id + 'no existe' }
                    });
                }
                if (!animal.img) {
                    logger.info('animal no tiene imagen');
                }
                // define path de una imagen anterior
                var pathViejo = './uploads/animales/' + animal.img;
                // si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo, (err) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error al intentar eliminar la imágen',
                                errors: err
                            });
                        }
                    });
                }
                logger.info('nombreArchivoC: ' + nombreArchivo);
                animal.img = nombreArchivo;
                animal.fechaModificacion = Date.now();
                animal.save((err, animalActualizado) => {

                    if (err) {
                        logger.error('Error al guardar archivo');
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar archivo',
                            erros: err,
                        });
                    }

                    logger.info('Archivo almacenado y movido correctamente' + animalActualizado);
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Archivo almacenado y movido correctamente',
                        animal: animalActualizado
                    });

                });

            });
        }
    }
    if (tipo === 'usuarios') {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            Usuario.findById(id, (err, usuario) => {
                if (!usuario) {
                    logger.error('El usuario con el id :' + id + 'no existe');
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'El usuario con el id :' + id + 'no existe',
                        errors: { message: 'El usuario con el id :' + id + 'no existe' }
                    });
                }
                if (!usuario.img) {
                    logger.info('usuario no tiene imagen');
                }
                // define path de una imagen anterior
                var pathViejo = './uploads/usuarios/' + usuario.img;
                // si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo, (err) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error al intentar eliminar la imágen',
                                errors: err
                            });
                        }
                    });
                }
                logger.info('nombreArchivoC: ' + nombreArchivo);
                usuario.img = nombreArchivo;
                usuario.fechaModificacion = Date.now();
                usuario.save((err, usuarioActualizado) => {
                    usuarioActualizado.password = ':)';

                    if (err) {
                        logger.error('Error al guardar archivo');
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar archivo',
                            erros: err,
                        });
                    }

                    logger.info('Archivo almacenado y movido correctamente' + usuarioActualizado);
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Archivo almacenado y movido correctamente',
                        usuario: usuarioActualizado
                    });

                });

            });
        }
    }
}

module.exports = app;