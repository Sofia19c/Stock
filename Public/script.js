//AQUI IRA LA LOGICA DEL BOTON
const boton = document.getElementById("btn-agregar");
let graficaStock = null;
let graficaCategorias = null;

//async dice que habran tareas que toman tiempo
boton.addEventListener("click", async () => {

    //id para conectar cada casilla en html con java script
    const nombre = document.getElementById("nombre").value;
    const categoria =document.getElementById("categoria").value;
    const cantidad = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;

    //Aqui no permite que se guarden valores vacios, se deben completar las 3 celdas
    if(!nombre || !cantidad ||! precio){
        alert("completa todos los campos");
        return;
    }
     //objeto en java 
    const producto = {
        nombre,
        categoria,
        cantidad,
        precio
    };

    //fetch es la herramienta nativa de JavaScript para hacer peticiones por internet. 
    //Aquí está tocando la puerta de una dirección en el servidor llamado /productos.
    //await le dice a JavaScript: "Detente un momento en esta línea y espera a que el 
    // servidor responda antes de continuar con la siguiente"
    const respuesta = await fetch("/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    //aqui se recibe la respuesta del servidor y se transforma en n objeto js facil de leer
    const data = await respuesta.json();

    // lansa mensaje de alerta avisando que la operacion fue exitosa
    alert(data.mensaje);

    //recargar automaticamente despues de agregar productos
    cargarProductos();

    //limpiar inputs
    // -- SIGNIFICADO INPUTS --
    //todos aquellos datos, recursos, materiales o información que se ingresan a un sistema o proceso 
    // para que este pueda funcionar, transformarlos y generar un resultado (conocido como output o salida).
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("precio").value = "";
    //document.getElementById("categoria").value; 
});

//FUNCION PARA MOSTRAR LOS PRODUCTOS
async function cargarProductos() {

    //fetch("/productos"): Envía una petición al servidor para pedir los datos
    //que están en la ruta /productos.
    const respuesta = await fetch("/productos");
    
    //Guarda la lista de productos real (un array) que ya puedo recorrer
    const productos = await respuesta.json();

    const enStock = 
        productos.filter(
            P => Number(P.cantidad) >= 5
        ).length;
    
    const pocoStock =
            productos.filter(
                p => 
                    Number(p.cantidad) > 0 &&
                    Number(p.cantidad) < 5
            ).length


    const sinStock = 
            productos.filter(
                P => Number(P.cantidad) === 0
            ).length

    
    const totalUnidades = productos.reduce(
        (total, producto) => total + Number(producto.cantidad),
        0
    );

    const textoBusqueda = document.getElementById("busqueda")
    ?.value
    //Toma el texto que escribió el usuario y lo convierte por completo a minúsculas.
    .toLowerCase() || "";

    // Aquí el código viaja al documento HTML de la página web y busca un elemento (una etiqueta <table>)
    //que tenga el atributo id="tabla-productos" y lo guarda en la variable tabla para poder modificarlo.
    const tabla = document.getElementById("tabla-productos");

    //Aqui cuenta cuantos productos diferentes hay registrados en el sistema
    const totalProductos =
        productos.length;

    //crea una nuev lista con los productos que cumplan la condicion
    //en este caso, los productos que sean menores a 5 
    const stockBajo =
        productos.filter(
            producto => Number(producto.cantidad) <5
        ).length;

    //Aqui se calcula el valor final del inventario
    const valorInventario =
        //reduce toma una lista de muchas cosas y la reduce a un solo valor final (en este caso, la suma total de dinero)
        productos.reduce(
            (total, producto) =>
                total + (
                    Number(producto.precio) *
                    Number(producto.cantidad)
                ),
            //Aqui le digo a js que empiece a contar desde 0
            0
        );

    const totalCarplay = 
        productos.filter(
            p => p.categoria === "CarPlay"
        ).reduce(
            (total, p) =>
                total + Number(p.cantidad),
            0
        );

    const totalCojines =
        productos.filter(
            p => p.categoria ==="Cojines"
        ).reduce(
            (total, p) =>
                total + Number(p.cantidad),
            0
        );

    const totalIntercom =
        productos.filter(
            p => p.categoria === "Intercomunicadores"
        ).reduce(
            (total, p) =>
                total + Number(p.cantidad),
            0
        );

    const totalOtros =
        productos.filter(
            p => p.categoria === "Otros"
        ).reduce(
            (total, p) =>
                total + Number(p.cantidad),
            0
        );

    const stockCarplay =
        totalCarplay < 5 ? 1 : 0;

    const stockCojines =
        totalCojines < 5 ? 1 : 0;

    const stockIntercom =
        totalIntercom < 5 ? 1 : 0;

    const stockOtros =
        totalOtros < 5 ? 1 : 0;

    //Aqui se actualiza el total de productos 
    document.getElementById(
        "total-productos"
    ).textContent = totalProductos;

    //Funciona igual que la linea anterior 
    //Actualiza la alerta de poco Stock
    document.getElementById(
        "stock-bajo-total"
    ).textContent = stockBajo;

    //Actualiza el valor del inventario con un formato mas bonito
    document.getElementById(
        "valor-total"
    ).textContent =  `$${valorInventario.toLocaleString()}`;

    document.getElementById(
    "en-stock"
    ).textContent = enStock;

    document.getElementById(
        "poco-stock"
    ).textContent = pocoStock;

    document.getElementById(
        "sin-stock"
    ).textContent = sinStock;

    document.getElementById(
        "total-carplay"
    ).textContent = totalCarplay;

    document.getElementById(
        "total-cojines"
    ).textContent = totalCojines;

    document.getElementById(
        "total-intercom"
    ).textContent = totalIntercom;

    // Esta línea limpia la tabla. Borra cualquier fila o texto que hubiera tenido antes. Esto se hace para que, si vuelves a cargar los productos,
    // no se dupliquen ni se acumulen con los viejos.
    tabla.innerHTML = "";

    productos
    .filter(producto =>
        producto.nombre
            .toLowerCase()
            .includes(textoBusqueda)
    )

    //Como productos es una lista, usamos .forEach() para recorrerlos uno por uno. En cada vuelta del ciclo, 
    //el producto actual se guardará en la variable producto.
    .forEach(producto => {
        
        let estado = "";

        if(Number(producto.cantidad) === 0){
            estado = "🔴 Sin stock";
        }
        else if(Number(producto.cantidad) < 5){
            estado = "🟠 Poco stock";
        }
        else{
            estado = "🟢 En stock";
}
        const precioTotal =
            Number(producto.precio) *
            Number(producto.cantidad);
    
        //el operador += significa "súmale esto a lo que ya había". En cada vuelta del ciclo,
        //agrega una nueva fila (<tr>)al final de la tabla 
        //Las comillas invertidas (``) permiten crear un template string, lo que nos deja mezclar texto HTML
        //con variables de JavaScript usando la sintaxis ${variable}
        //los <td> etc son celdas de la tabla 
        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.cantidad}</td>
                <td>$${Number(producto.precio).toLocaleString()}</td>
                <td>$${precioTotal.toLocaleString()}</td>
               <td class="${
                    Number(producto.cantidad) === 0
                    ? "stock-sin"
                    :Number(producto.cantidad) < 5
                        ? "stock-bajo"
                        : "stock-ok"
                }">
                ${estado}
                </td>

                <td>
                    <button onclick="editarCantidad('${producto._id}', 1)">
                        +
                    </button>

                    <button onclick="editarCantidad('${producto._id}', -1)">
                        -
                    </button>

                    <button onclick="eliminarProducto('${producto._id}')">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });

    const ctx = document.getElementById(
        "graficaCategorias"
    );

    if(graficaCategorias){
        graficaCategorias.destroy();
    }

    graficaCategorias = new Chart(ctx,{
        type:"doughnut",

        data:{
            labels:[
                "CarPlay",
                "Cojines",
                "Intercomunicadores",
                "Otros"
            ],
            datasets:[{
                data:[
                    totalCarplay,
                    totalCojines,
                    totalIntercom,
                    totalOtros
                ],
                backgroundColor:[
                    "#4f46e5",
                    "#ea580c",
                    "#16a34a",
                    "#64748b"
                ]
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false,

            plugins:{
                legend:{
                    position:"bottom"
                }
            }

        }
    });

    const ctxStock = 
        document.getElementById(
            "graficaStock"
        );

    if(graficaStock){
        graficaStock.destroy();
    }

    graficaStock =
        new Chart(ctxStock,{
            type:"doughnut",

            data:{

                labels:[
                    "En Stock",
                    "Poco Stock",
                    "Sin Stock"
                ],

                datasets:[{
                    data:[
                        enStock,
                        pocoStock,
                        sinStock
                    ],

                    backgroundColor:[
                        "#22c55e",
                        "#f59e0b",
                        "#ef4444"
                        
                    ],
                    
                    borderWidth:0

                }]
            },

            options:{
                responsive:true,
                maintainAspectRatio:false,

                plugins:{
                    legend:{
                        display:false
                    }
                }
            }
        });
}

//Recibe dos parámetros: el id del producto a modificar y el cambio (que será 1 o -1).
    async function editarCantidad(id, cambio) {
       
        //productos/${id}`: Usando comillas invertidas, le insertamos el ID directamente a la URL.
        //Si toque el producto 12, la petición se enviará a /productos/12`
        await fetch(`/productos/${id}`, {
            //usamos PUT porque nuestra intención es actualizar o modificar un dato existente en el servidor
            method: "PUT",
            //contiene la etiqueta del tipo de paquete que se envia
            headers:{
                "Content-Type": "application/json"
            },

            //
            body: JSON.stringify({
                cambio
            })
        });

        cargarProductos();
    }  
    
    async function eliminarProducto(id) {
        
        const confirmar = confirm(
            "¿Seguro que quieres eliminar este producto?"
        );

        if (!confirmar) return;

        await fetch(`/productos/${id}`, {
            method: "Delete"
        });

        cargarProductos();
    }
cargarProductos();

//Actualizar al escribir en la barra de busqueda
document
.getElementById("busqueda")
.addEventListener("input", () =>{
    cargarProductos();
});

const botonExcel =
    document.getElementById(
        "btn-excel"
    );

botonExcel.addEventListener(
    "click",
    () => {

        window.location.href =
            "/exportar-excel";
    }
);
