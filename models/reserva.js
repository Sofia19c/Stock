const mongoose =
    require("mongoose");

const reservaSchema =
    new mongoose.Schema({

        cliente:{
            type:String,
            required:true
        },

        producto:{
            type:String,
            required:true
        },

        cantidad:{
            type:Number,
            required:true
        },

        estado:{
            type:String,
            default:"Reservada"
        },

        fecha:{
            type:Date,
            default:Date.now
        }

    });

module.exports =
    mongoose.model(
        "Reserva",
        reservaSchema
    );