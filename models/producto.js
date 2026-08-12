//Aqui importo la libreria mongoose
const mongoose = require("mongoose");

//Aqui creo un esquema, con una estructura definida para guardar los productos
const productoSchema =
new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    categoria: {
        type: String,
        required: true,
        default: "Otros"
    },

    cantidad: {
        type: Number,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },
    
    venta:{
        type:Number,
        default:0
    },

    tipoInversion: {
        type: String,
        default: ""
    },

    productosVendidos: {
        type: Number,
        default: 0
    }
});

//Aqui implemento el modelo
module.exports =
mongoose.model(
    "Producto",
    productoSchema
);