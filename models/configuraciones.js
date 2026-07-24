const mongoose = require("mongoose");

const configuracionSchema =
new mongoose.Schema({

    nombre:{
        type:String,
        default:"Inventario Pro"
    },

    propietario:{
        type:String,
        default:""
    },

    telefono:{
        type:String,
        default:""
    },

    correo:{
        type:String,
        default:""
    },

    tema:{
        type:String,
        default:"claro"
    }
});

module.exports =
mongoose.model(
    "Configuracion",
    configuracionSchema
);