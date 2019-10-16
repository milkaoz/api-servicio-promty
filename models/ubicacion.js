var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tiposDeUbicaciones = {
    values: ['zona', 'departamento', 'seccion', 'pasillo', 'sala'],
    message: '{VALUE} no es un tipo de ubicacion valido'
};

var ubicacionSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre de la ubicacion es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    planta: { type: String, required: false, default: '' },
    tipoUbicacion: { type: String, required: true, enum: tiposDeUbicaciones },
    vigente: { type: Boolean, required: [true, 'Se debe indicar si esta vigente la ubicacion'] },
    fechaCreacion: { type: Date, required: true, default: Date.now },
    fechaModificacion: { type: Date, required: true, default: Date.now },

});

ubicacionSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Ubicacion', ubicacionSchema);