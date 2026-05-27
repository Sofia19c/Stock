//Importa la librería Express, que sirve para crear servidores web y APIs
const { error } = require("console");
const express = require("express");
// Importa el modulo fs(File System)
// Se usa para leer, escribir o manipular archivos en el sistema
const fs = require("fs");
//Importa el módulo nativo path.
//Ayuda a trabajar con rutas de archivos y carpetas.
const path = require ("path");
const { json } = require("stream/consumers");
//Crea una aplicación de Express.
//app será el objeto principal para configurar rutas, middleware y el servidor.
const app = express();
// puerto donde correra el servidor
const PORT = process.env.PORT || 3000;
//Activa un middleware para que Express pueda entender datos en formato JSON.
//Muy útil cuando el frontend envía información mediante POST, PUT, etc.
app.use(express.json());
//Le dice a Express: sirve los archivos HTML, CSS y JS que están en Public/
// es para que render pueda abrir index.html
app.use(express.static("Public"));

//MOSTRAR PRODUCTOS EN LA TABLA
//Aqui esta escuchando la peticion POST en la direccion /producto
//esta peticion fue enviada en la linea 23 del archivo script.js
//req contiene todo lo que viene de afuera
//res es lo que el servidor usara para contestarle al navegador
app.post("/productos",(req, res)=>{
    //Aqui es donde llega el producto que el usuario escribio (nombre, cantidad, precio)
    //el servidor lo extrae del cuerpo de la peticion y lo guarda en la variable
    const nuevoProducto = req.body;
    //busca donde guardar esa variable, y dirname es en el directorio actual, en data en produc..json
    const rutaArchivo = path.join(__dirname, "data", "productos.json");
    //lee el archio con los productos ingresados , utf 8 Es el formato de codificación para que 
    // Node lea el archivo como texto con acentos y caracteres normales, y no como datos binarios
    //(error, data) es una función que se ejecutará cuando termine de leer. Si algo sale mal,
    //se llena la variable error. Si todo sale bien, el contenido del archivo se guarda en data.
    fs.readFile(rutaArchivo,"utf8", (error,data)=>{

        if (error){
            return res.status(500).json({
                mensaje:"Error leyendo archivo"
            });
        }

        //JSON.parse(data): El archivo se lee como texto plano. 
        //esta línea lo transforma mágicamente en una lista de JavaScript (un array) para poder manipularlo.
        const productos = JSON.parse(data);
        //Para que los productos no se confundan, les creao un id único. Date.now()
        nuevoProducto.id = Date.now();
        //Meto el nuevo producto al final de la lista que acabo de leer.
        productos.push(nuevoProducto);

        //guarda la lista actualizada
        fs.writeFile(
            rutaArchivo,
            //convierte la lista de javascript en un archivo de texto plano para que sea legible
            JSON.stringify(productos,null,2),
            (error) =>{
                if (error){
                    return res.status(500).json({
                        mensaje: "Error guardando producto"
                    });
                }

                res.json({
                    mensaje: "Producto guardado correctamente"
                });
            }
        );
    });
});


//escucha las peticiones de tipo GEST en la direccion /productos
app.get("/productos",(req, res) => {
    //construir la direccion donde estan guardado el archivo con los productos
    const rutaArchivo =path.join(
        __dirname,
        "data",
        "productos.json"
    );
    //Aqui abre y lee el contenido del archivo de texto
    fs.readFile(rutaArchivo, "utf8", (error, data) =>{
        if(error){
            return res.status(500).json({
                mensaje: "Error leyendo productos"
            });
        }
        //Transformar el texto plano del archivo en datos reales de JavaScript.
        const productos = JSON.parse(data);

        //: Enviar los productos de vuelta al navegador que los pidió y cerrar la función.
        res.json(productos);
    });
});

//El método HTTP PUT se usa por convención cuando queremos actualizar o modificar datos que ya existen.
app.put("/productos/:id",(req, res)=>{
    // Extrae el ID que venia en la URL y lo pone como numero real
    const id =Number(req.params.id);
    //extrae la peticion el 1 o -1 que agregue
    const cambio = req.body.cambio;

    //construyo la direccion donde esta guardado el archivo de texto productos.json
    const rutaArchivo = path.join(
         __dirname,
        "data",
        "productos.json"
    );

    //
    fs.readFile(rutaArchivo, "utf8", (error, data) =>{
        if(error){
            return res.status(500).json({
                mensaje: "Error leyendo archivo"
            });
        }

        //Como el archivo se lee como texto plano
        //JSON.parse lo transforma mágicamente en un array de objetos de JavaScript
        const productos = JSON.parse(data);

        //Usa la función .find() para buscar dentro de la lista el primer producto 
        //cuyo id coincida exactamente con el id que venía en la URL.
        const producto = productos.find(
            p => p.id ===id
        );

        if(!producto){
            return res.status(500).json({
                mensaje:"Producto no encontrado"
            }); 
        }

        //Toma la cantidad actual del producto encontrado, 
        //se asegura de que sea un número, y le suma el cambio (que puede ser +1 o -1)
        //ademas muestra un error si el producto es menor a 0 (para evitar valores negativos)
        const nuevaCantidad =
            Number(producto.cantidad) + cambio; 

        if (nuevaCantidad < 0){
            return res.status(400).json({
                mensaje: "La cantidad no puede ser menor a 0"
            });
        }

        producto.cantidad = nuevaCantidad;
        
        //Como el cambio solo se hizo en la memoria temporal del servidor,
        //ahora hay que sobreescribir el archivo físico para guardar los cambios permanentemente.
        fs.writeFile(
            rutaArchivo,
            //transforma nuestro array de JavaScript de vuelta a un texto JSON limpio y ordenado
            JSON.stringify(productos, null, 2),
            (error) => {

                if (error){
                    return res.status(500).json({
                    mensaje: "Error actualizado"
                    });
            }
              
                res.json({
                    mensaje: "Cantidad actualizada"
                });
            }
        );
    });
});

app.delete("/productos/:id", (req, res) =>{

    const id= Number(req.params.id);

    const rutaArchivo= path.join(
        __dirname,
        "data",
        "productos.json"
    );

    fs.readFile(rutaArchivo, "utf-8", (error, data) =>{

        if (error){
            return res.status(500).json({
                mensaje: "Error leyendo el archivo"
            });
        }

        //Sirve para convertir una cadena de texto (string) en formato JSON
        let productos = JSON.parse(data);

        //eliminar producto de la lista
        // => significa que examina cada producto de la lista 
        //producto.id !== id: Esta es la condición. 
        //Compara el ID del producto actual con el id que quiero eliminar
        productos = productos.filter(
            producto => producto.id !== id
        );


        //Aqui se guardam los cambios en un archivo de texto
        fs.writeFile(
            rutaArchivo,
            JSON.stringify(productos, null, 2),
            (error) => {

                if (error){
                    return res.status(500).json({
                        mensaje: "Error liminando"
                    });
                }

                res.json({
                    mensaje: "Producto eliminado"
                });
            }
        );

    });
});


app.listen(PORT, () => { //escucha en el puerto
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
