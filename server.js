require("dotenv").config();
const mongoose = require("mongoose");

const Inversion = require("./models/inversion");

const Producto = require("./models/producto");

const Reserva = require("./models/reserva");
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
            
            categoria:
                req.body.categoria,
            
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
(
    "/productos/:id",
    async (req, res) => {

    try {

        const id =
            req.params.id;

        const cambio =
            req.bapp.putody.cambio;

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
                header: "Precio Unitario",
                key: "precio",
                width: 15
            },
            {
                header: "Precio Total",
                key: "precioTotal",
                width: 15
            }
        ];

        // Formato de moneda para Excel
        worksheet.getColumn("precio").numFmt =
            '$#,##0';

        worksheet.getColumn("precioTotal").numFmt =
            '$#,##0';

        //Agregar productos
        productos.forEach(producto => {

            worksheet.addRow({
                nombre:
                    producto.nombre,

                cantidad:
                    producto.cantidad,

                precio:
                    producto.precio,

                precioTotal:
                        
                    Number(producto.precio) *
                    Number(producto.cantidad)
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

app.post("/inversiones", async (req,res)=> {
    const nuevaInversion = 
    new Inversion(req.body);

    await nuevaInversion.save();

    res.json({
        mensaje:"Inversión guardada"
    });
});

app.delete(
    "/inversiones/:id",
    async (req,res) => {

        try{
            await Inversion.findByIdAndDelete(
                req.params.id
            );

            res.json({
                mensaje: "Inversion eliminada"
            });
        }catch(error){
            console.log(error);

            res.status(500).json({
                mensaje: "Error eliminando inversión"
            });
        }
    }

);

app.put(
    "/inversiones/:id",
    async (req, res) =>{
        try{
            const inversion =
                await Inversion.findById(
                    req.params.id
                );
            
            inversion.recuperado +=
                Number(
                    req.body.cambio
                );
            
            if(
                inversion.recuperado < 0
            ){
                inversion.recuperado = 0;
            }

            await inversion.save();

            res.json({
                mensaje:
                "Actualizado"
            });
        }catch(error){
            consol.log(error); 

            res.status(500).json({
                mensaje:
                "Error"
            });
        }
    }
)

app.listen(PORT, () => { //escucha en el puerto
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/inversiones", async (req,res)=> {
    const inversiones =
    await Inversion.find();

    res.json(inversiones);
});

app.delete("/inversiones/:id", async(req,res)=>{

    await Inversion.findByIdAndDelete(
        req.params.id
    );

    res.json({
       mensaje:"Inversión eliminada" 
    });

});

app.get("/reservas", async(req,res) =>{
    try{
        const reservas = await Reserva.find();
        res.json(reservas);

    }catch(error){
        
        console.log(error);
        
        res.status(500).json({
            mensaje:
            "Error leyendo reservas"
        });
    }
});

app.post(
    "/reservas", 
    async (req,res)=>{
        try{
            const nuevaReserva = new Reserva(req.body);
            await nuevaReserva.save();

            res.json({
                mensaje: 
                "Reserva guardada"
            });
        }catch(error){
            console.log(error);

            res.status(500).json({
                mensaje:
                "Error guardando reserva"
            });
        }
    }
);

app.delete(
    "/reservas/:id",
    async (req,res)=>{
        try{

            await Reserva.findByIdAndDelete(
                req.params.id
            );

            res.json({
                mensaje:
                "Reserva eliminada"
            });

        }catch(error){
            console.log(error);

            res.status(500).json({
                mensaje:
                "Error eliminando reserva"
            });
        }
    }
);

app.patch(
    "/reservas/:id",
    async(req,res)=>{

        try{

            await Reserva.findByIdAndUpdate(

                req.params.id,

                {
                    estado:"Entregada"
                }

            );

            res.json({
                mensaje:"Reserva entregada"
            });

        }catch(error){

            console.log(error);

            res.status(500).json({
                mensaje:"Error"
            });

        }

    }
);

app.patch(
    "/reservas/cancelar/:id",
    async (req,res)=>{

        try{
            await Reserva.findByIdAndUpdate(
                req.params.id,
                {
                    estado:"Cancelada"
                }
            );

            res.json({
                mensaje:"Reserva cancelada"
            });

        }catch(error){
            console.log(error);

            res.status(500).json({
                mensaje:"Error"
            });
        }
    }
);

//Ruta para guardar productos
app.post(
    "/productos",
    async(req, res)=>{
        try{
            const nuevoProducto =
                new Producto(req.body);

            await nuevoProducto.save();

            res.json({
                mensaje:
                "Producto guardado"
            });
        }catch(error){
            console.log(error);

            res.status(500).json({
                mensaje:
                "Error guardando producto"
            });
        }
    }
);

app.delete(
    "/productos/:id",
    async(req,res)=>{
        try{
            await Producto.findByIdAndDelete(
                req.params.id
            );

            res.json({
                mensaje:
                "Producto eliminado"
            });
        }catch(error){
            console.log(error);

            res.status(500).json({
                mensaje:
                "Error eliminando producto"
            });
        }
    }
);

app.put("/productos/:id", async (req, res) => {

    console.log("🔥 ENTRE AL PUT 🔥");

    try {

        console.log("ID:", req.params.id);
        console.log("BODY:", req.body);

        const producto = await Producto.findById(req.params.id);

        console.log("Producto encontrado:", producto);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        producto.nombre = req.body.nombre;
        producto.categoria = req.body.categoria;
        producto.cantidad = req.body.cantidad;
        producto.precio = req.body.precio;
        producto.venta = req.body.venta;

        await producto.save();

        res.json({
            mensaje: "Producto actualizado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

});

app.get("/reportes/inventario", async(req,res) =>{
    try{
        const productos = 
            await Producto.find();
        
        const workbook =
            new ExcelJS.Workbook();

        const hoja =
            workbook.addWorksheet("Inventario");

        hoja.columns = [
            {
                header: "Producto",
                key: "nombre",
                width: 30
            },

            {
                header: "Categoria",
                key: "categoria",
                width: 20
            },

            { 
                header: "Cantidad",
                key: "cantidad",
                width: 15
            },

            {
                header: "Precio Compra",
                key: "precio",
                width: 20
            },

            {
                header: "Precio Venta",
                key: "venta",
                width: 20
            }
        ];

        productos.forEach(productos =>{
            hoja.addRow({
                nombre: producto.nombre,
                categoria: producto.categoria,
                cantidad: producto.cantidad,
                venta: producto.venta
            });
        });

        const archivo = "Inventario.xlsx";
        //este metodo sive para definir el formato de los datos
        res.setHeader(
            "content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "content-Disposiion",
            `attachment; filename= "${archivo}"`
        );

        await workbook.xlsx.write(res);
        res.end();
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            mensaje: "Error generando reporte"
        });
    }
});

app.get("/reportes/poco-stock", async (req, res) =>{

    try{
        const productos = await Producto.find({
            cantidad:{ $gt: 0, $lt: 5}
        });

        const workbook = new ExcelJS.Workbook();
        const hoja = workbook.addWorksheet("Poco Stock");

        hoja.columns = [
            {header: "Producto", key: "nombre", width: 30},
            {header: "Categoria", key: "categoria", width: 20},
            {header: "Cantidad", key: "cantidad", width: 15 }
        ];

        productos.forEach(p =>{
            hoja.addRow({
                nombre: p.nombre,
                categoria: p.categoria,
                cantidad: p.cantidad
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ),

         res.setHeader(
            "Content-Disposition",
            'attachment; filename="PocoStock.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch(error) {

        console.log(error);
        res.status(500).json({
            mensaje: "Error generando reporte"
        });

        
    }
});

app.get("/reportes/reservas", async (req, res) => {

    try {

        const reservas = await Reserva.find();

        const workbook = new ExcelJS.Workbook();
        const hoja = workbook.addWorksheet("Reservas");

        hoja.columns = [
            { header: "Cliente", key: "cliente", width: 25 },
            { header: "Producto", key: "producto", width: 25 },
            { header: "Cantidad", key: "cantidad", width: 15 },
            { header: "Estado", key: "estado", width: 20 }
        ];

        reservas.forEach(r => {
            hoja.addRow({
                cliente: r.cliente,
                producto: r.producto,
                cantidad: r.cantidad,
                estado: r.estado
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Reservas.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch(error) {

        console.log(error);
        res.status(500).json({
            mensaje: "Error generando reporte"
        });

    }

});

app.get("/reportes/inversiones", async (req, res) => {

    try {

        const inversiones = await Inversion.find();

        const workbook = new ExcelJS.Workbook();
        const hoja = workbook.addWorksheet("Inversiones");

        hoja.columns = [
            { header: "Producto", key: "producto", width: 30 },
            { header: "Cantidad", key: "cantidad", width: 15 },
            { header: "Precio Compra", key: "precioCompra", width: 20 },
            { header: "Precio Venta", key: "precioVenta", width: 20 }
        ];

        inversiones.forEach(i => {
            hoja.addRow({
                producto: i.producto,
                cantidad: i.cantidad,
                precioCompra: i.precioCompra,
                precioVenta: i.precioVenta
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Inversiones.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch(error) {

        console.log(error);
        res.status(500).json({
            mensaje: "Error generando reporte"
        });

    }

});