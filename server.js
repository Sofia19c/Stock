require("dotenv").config();
const mongoose = require("mongoose");

const Producto =
require("./models/producto");
//Importa la librería Express, que sirve para crear servidores web y APIs
const { error } = require("console");
const express = require("express");
//Importa la liberira para exportar documentos de excel
const ExcelJS = require("exceljs");
// Importa el modulo fs(File System)
// Se usa para leer, escribir o manipular archivos en el sistema
const fs = require("fs");
//Importa el módulo nativo path.
//Ayuda a trabajar con rutas de archivos y carpetas.
const path = require ("path");
const { json } = require("stream/consumers");
const producto = require("./models/producto");
//Crea una aplicación de Express.
//app será el objeto principal para configurar rutas, middleware y el servidor.
const app = express();
// puerto donde correra el servidor
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB conectado 🚀");
})
.catch((error) => {
    console.log("Error MongoDB:", error);
});

//Activa un middleware para que Express pueda entender datos en formato JSON.
//Muy útil cuando el frontend envía información mediante POST, PUT, etc.
app.use(express.json());
//Le dice a Express: sirve los archivos HTML, CSS y JS que están en Public/
// es para que render pueda abrir index.html
app.use(express.static("Public"));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "Public",
            "Index.html"
        )
    );
});
//MOSTRAR PRODUCTOS EN LA TABLA
//Aqui esta escuchando la peticion POST en la direccion /producto
//req contiene todo lo que viene de afuera
//res es lo que el servidor usara para contestarle al navegador
app.post("/productos", async (req, res) =>{
    try{
        const nuevoProducto = 
        new Producto({
            nombre:
                req.body.nombre, 
            
            cantidad:
                Number(
                    req.body.cantidad
                ),
            precio:
                Number(
                    req.body.precio
                )
        });

        await nuevoProducto.save();

        res.json({
            mensaje:
            "Producto guardado correctamente "
        });
    } catch (error){
        console.log(error);

        res.status(500).json({
            mensaje:
            "Error guardando producto"
        });
    }
});

//escucha las peticiones de tipo GEST en la direccion /productos
//Aqui busca los productos directamente en MongoDB
app.get("/productos", async (req, res) => {
    
    try{
        const productos = await Producto.find();

        res.json(productos);

    }catch (error) {

         console.log(
            "ERROR PRODUCTOS:",
            error
        );

        res.status(500).json({
            mensaje:
            "Error leyendo productos"
        });
    }
    
});

//El método HTTP PUT se usa por convención cuando queremos actualizar o modificar datos que ya existen.
app.put(
    "/productos/:id",
    async (req, res) => {

    try {

        const id =
            req.params.id;

        const cambio =
            req.body.cambio;

        const producto =
            await Producto.findById(id);

        if (!producto) {

            return res.status(404).json({
                mensaje:
                "Producto no encontrado"
            });
        }

        const nuevaCantidad =
            producto.cantidad + cambio;

        if (
            nuevaCantidad < 0
        ) {

            return res.status(400).json({
                mensaje:
                "La cantidad no puede ser menor a 0"
            });
        }

        producto.cantidad =
            nuevaCantidad;

        await producto.save();

        res.json({
            mensaje:
            "Cantidad actualizada"
        });

    } catch (error) {

        res.status(500).json({
            mensaje:
            "Error actualizando producto"
        });
    }
});

app.delete("/productos/:id", async (req, res) =>{

    try{
        const id = 
            req.params.id;

        const producto =
            await Producto.findByIdAndDelete(id);
        
        if(!producto){
            return res.status(400).json({
                mensaje:
                "Producto no encontrado"
            });
        }

        res.json({
            mensaje:
            "Producto eliminado"
        });

    }catch (error){
        res.status(500).json({
            mensaje:
            "Error eliminando producto"
        });
    }
});

app.get("/exportar-excel", async (req, res) => {

   try{
        //Traer productos desde MongoDB
        const productos = 
            await Producto.find(); 

        //Crear libro Excel en blanco
        const workbook = 
            new ExcelJS.Workbook();

        const worksheet =
            workbook.addWorksheet("Inventario");

        //Columnas del excel donde se guardaran los productos
        worksheet.columns = [
            {
                header: "Producto",
                key: "nombre",
                width: 25
            },
            {
                header: "Cantidad",
                key: "cantidad",
                width: 15
            },
            {
                header: "Precio",
                key: "precio",
                width: 15
            }
        ];

        //Agregar productos
        productos.forEach(producto => {
            worksheet.addRow({
                nombre:
                    producto.nombre,

                cantidad:
                    producto.cantidad,

                precio:
                    producto.precio
            });
        });

        //Configurar descarga
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=inventario.xlsx"
        );

        // Enviar Excel
        await workbook.xlsx.write(res);

        res.end();

   } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje:
            "Error exportando Excel"
        });
    }
});

app.listen(PORT, () => { //escucha en el puerto
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

