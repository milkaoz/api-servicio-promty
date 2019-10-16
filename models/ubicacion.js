var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ubicacionSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre de la ubicacion es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    planta: { type: String, required: false, default: '' },
    tipoUbicacion: { type: String, required: false },
    //    vigente: { type: Boolean, required: [true, 'Se debe indicar si esta vigente la ubicacion'] },
    //   fechaCreacion: { type: Date, required: true, default: Date.now },
    //   fechaModificacion: { type: Date, required: true, default: Date.now },

});

module.exports = mongoose.model('Ubicacion', ubicacionSchema);