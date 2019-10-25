var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var clasesDeAnimales = {
    values: ['mamifero', 'ave', 'pez', 'anfibio', 'reptil', 'artropodos', 'equinodermos', 'anelidos', 'nidarios'],
    message: '{VALUE} no es una clase de animal valido'
};

var ordenDeAnimales = {
    values: ['herbivoro', 'carnivoro', 'omnivoro'],
    message: '{VALUE} no es un orden de animal valido'
};

var animalSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre del animal es necesario'] },
    name: { type: String, required: [true, 'La descripcion es necesaria'] },
    nombreCientifico: { type: String, required: false },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    img: { Type: String, required: false },
    ubicacion: { type: Schema.Types.ObjectId, ref: 'Ubicacion' },
    claseAnimal: { type: String, required: true, enum: clasesDeAnimales },
    ordenAnimal: { type: String, required: true, enum: ordenDeAnimales },
    activo: { type: Boolean, required: [true, 'Se debe indicar si esta activo el animal'] },
    fechaCreacion: { type: Date, required: true, default: Date.now },
    fechaModificacion: { type: Date, required: true, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'animales' });

animalSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Animal', animalSchema);