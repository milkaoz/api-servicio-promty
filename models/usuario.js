var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: [true, 'El Rol es requerido'], default: 'USER_ROLE', enum: rolesValidos },
    fechaCreacion: { type: Date, required: true, default: Date.now },
    fechaModificacion: { type: Date, required: true, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    google: { type: Boolean, default: false },
}, { collection: 'usuarios' });

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);