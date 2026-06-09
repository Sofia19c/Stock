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

    precioUnitario: {
        type: Number,
        required: true
    }
});

//Aqui implemento el modelo
module.exports =
mongoose.model(
    "Producto",
    productoSchema
);