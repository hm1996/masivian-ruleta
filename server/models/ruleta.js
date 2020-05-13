let { Schema, model } = require('mongoose');

let estados = {
    values: ['creada', 'abierta', 'cerrada']
};


let ruletaSchema = new Schema({
    apuestas: {
        type: Array,
        default: []
    },
    estado: {
        type: String,
        enum: estados,
        default: 'creada',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: new Date()
    },
    fechaClausura:{
        type: Date
    },
    fechaApertura:{
        type: Date
    }
});

module.exports = model('Ruleta', ruletaSchema);