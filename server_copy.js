require("dotenv").config();
const mongoose = require("mongoose");

const Inversion = require("./models/inversion");

const Producto = require("./models/producto");

const Reserva = require("./models/reserva");

const Configuracion = require("./models/configuraciones");
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

app.get("/reportes/resumen", async (req, res) => {

    try {

        const productos =
            await Producto.find();

        const reservas =
            await Reserva.find();

        const inversiones =
            await Inversion.find();

        const valorInventario =
            productos.reduce(
                (total, producto) =>
                    total +
                    (
                        Number(producto.precio) *
                        Number(producto.cantidad)
                    ),
                0
            );

        const totalInvertido =
            inversiones.reduce(
                (total, inversion) =>
                    total +
                    Number(inversion.invertido),
                0
            );

        res.json({
            valorInventario,
            totalProductos: productos.length,
            totalReservas: reservas.length,
            totalInvertido
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error obteniendo resumen"
        });

    }

});

app.get("/reportes/graficas", async (req, res) =>{

    //consulta de bases de datos 
    try{

        //Consulta la base de datos para traer todos los registros de la colección de productos.
        const productos =
            await Producto.find();

        //Crea un objeto vacío llamado categorias donde se agrupará el stock total sumado por cada categoría
        const categorias = {};

        //Inicializa tres contadores numéricos en 0 para clasificar los productos según su disponibilidad.
        let enStock = 0;
        let pocoStock = 0;
        let sinStock = 0;

        productos.forEach(producto => {
        //recorre el bucle 

            //Categorias
            //Verifica si la categoría del producto actual aún no existe como clave dentro del objeto categorias. Si no existe, la inicializa en 0.
            if(!categorias[producto.categoria]){
                categorias[producto.categoria] = 0;
            }

            //Le suma al acumulador de esa categoría la cantidad del producto actual. Se usa Number(...) para asegurar que el valor sea numérico
            // y evitar concatenaciones de texto.
            categorias[producto.categoria] += 
                Number(producto.cantidad);

            //Calsificación segun el estado del stock
            if(producto.cantidad === 0){
                sinStock++;
            }
            else if(producto.cantidad < 5){
                pocoStock++;
            }
            else{
                enStock++;
            }
        });

        // Envía una respuesta al cliente en formato JSON con código de estado HTTP 200 (OK).
        res.json({
            categorias,

            estado:{
                enStock,
                pocoStock,
                sinStock
            }
        });
    }
    catch (error){
        console.log(error);

        res.status(500).json({
            mensaje:"Error cargando gráficas"
        });
    }
});

app.get(
    "/configuraciones",
    async(req,res)=>{
        try{
            let configuracion =
                await Configuracion.findOne();
            
            if(!configuracion){
                configuracion =
                    await Configuracion.create({});
            }

            res.json(configuracion);

        }catch(error){
            console.log(error);
            res.status(500).json({
                mensaje:"Error cargando configuración"
            });
        }
    }
);

app.put(
    "/configuraciones",
    async(req, res)=>{
        try{
            let configuracion =
                await Configuracion.findOne();

            if(!configuracion){
                configuracion =
                    new Configuracion();
            }

            configuracion.nombre =
                req.body.nombre;
            
            configuracion.propietario =
                req.body.propietario;
            
            configuracion.telefono =
                req.body.telefono;

            configuracion.correo =
                req.body.correo;

            configuracion.tema =
                req.body.tema;
            
            await configuracion.save();

            res.json({
                mensaje:"Configuracion actualizada"
            });
        }catch(error){
            console.log(error);

            res.status(500).json({
                mensaje:"Error actualizando configuracion"
            });
        }

    }
);

app.get("/backup/exportar", async (req, res) => {
    try{
        const productos =
            await Producto.find();

         const reservas =
            await Reserva.find();

        const inversiones =
            await Inversion.find();

        const configuracion =
            await Configuracion.findOne();

        const backup = {

            fecha:
                new Date(),

            productos,
            reservas,
            inversiones,
            configuracion
        };


        res.setHeader(
            "Content-Type",
            "application/json"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="backup.json"'
        );
        
        res.send(
            JSON.stringify(
                backup,
                null,
                2
            )
        );
    }catch(error){
        console.log(error);

        res.status(500).json({
            mensaje:"Error exportando respaldo"
        })
    }
});

app.post("/backup/restaurar", async(req,res)=>{

    try{

    const backup =
        req.body;

    console.log(backup);

    }catch(error){

        console.log(error);

        res.status(500).json({
            mensaje:"Error restaurando respaldo"
        });

    }
    try{
        const backup =
            req.body;

        // Limpiar colecciones
        await Producto.deleteMany({});
        await Reserva.deleteMany({});
        await Inversion.deleteMany({});
        await Configuracion.deleteMany({});

        // Restaurar productos
        if(backup.productos?.length){

            await Producto.insertMany(
                backup.productos
            );

        }

        // Restaurar reservas
        if(backup.reservas?.length){

            await Reserva.insertMany(
                backup.reservas
            );

        }

        // Restaurar inversiones
        if(backup.inversiones?.length){

            await Inversion.insertMany(
                backup.inversiones
            );

        }

        // Restaurar configuración
        if(backup.configuracion){

            await Configuracion.create(
                backup.configuracion
            );

        }

        res.json({

            mensaje:
                "Respaldo restaurado correctamente"

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            mensaje:
                "Error restaurando respaldo"

        });

    }

});