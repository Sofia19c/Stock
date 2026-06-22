const moongose = require("mongoose");

const inversionSchema =
new moongose.Schema({

    producto:{
        type:String,
        required:true
    },

    tipo:{
    type:String,
    default:"Inventario"
    },

    invertido:{
        type:Number,
        required:true
    },

    recuperado:{
        type:Number,
        default:0
    },

    fecha:{
        type:Date,
        default:Date.now
    }
});

module.exports =
moongose.model(
    "Inversion",
    inversionSchema
);