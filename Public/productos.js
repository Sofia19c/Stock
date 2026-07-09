let productoEditando = null;

const botonNuevo =
    document.querySelector(
        ".btn-nuevo"
    );

const modal =
    document.getElementById(
        "modal-producto"
    );

botonNuevo.addEventListener(
    "click",
    ()=>{

        modal.style.display =
            "flex";

    }
);

modal.addEventListener(
    "click",
    (e)=>{

        if(
            e.target === modal
        ){

            modal.style.display =
                "none";

        }

    }
);

const botonGuardar =
    document.getElementById(
        "guardar-producto"
    );

    botonGuardar.addEventListener(
        "click",
        guardarProducto
    );

async function guardarProducto(){

    const nombre =
        document.getElementById(
            "nombre"
        ).value;

    const categoria =
        document.getElementById(
            "categoria"
        ).value;

    const cantidad =
        Number(
            document.getElementById(
                "cantidad"
            ).value
        );

    const compra =
        Number(
            document.getElementById(
                "compra"
            ).value
        );
    
    const venta =
        Number(
            document.getElementById(
                "venta"
            ).value
        );

    if(
        !nombre ||
        !categoria
    ){
        alert(
            "Completa todos los campos"
        );

        return;
    }


    const url =
        productoEditando
            ? `/productos/${productoEditando}`
            : "/productos";

    const metodo =
        productoEditando
            ? "PUT"
            : "POST";

    console.log("productoEditando:", productoEditando);
    console.log("URL:", url);

    //UWU
    const respuesta = await fetch("http://localhost:3000" + url,{
        
    method: metodo,
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify({
        nombre,
        categoria,
        cantidad,
        precio: compra,
        venta
        })
    });

console.log(respuesta.status);
console.log(respuesta.statusText);

const datos = await respuesta.json();
alert(JSON.stringify(datos, null, 2));

    modal.style.display=
        "none";
    productoEditando = null;
    document.getElementById(
        "guardar-producto"
    ).textContent =
        "Guardar";
    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("compra").value = "";
    document.getElementById("venta").value = "";

    cargarProductos(); 
}

async function cargarProductos() {
    const respuesta =
        await fetch(
            "/productos"
        );

    const productos =
        await respuesta.json();

    const totalProductos =
    productos.length;

    const stockTotal =
        productos.reduce(
            (total, producto) =>
                total + Number(producto.cantidad),
            0
        );

    const pocoStock =
        productos.filter(
            producto =>
                Number(producto.cantidad) > 0 &&
                Number(producto.cantidad) < 5
        ).length;

    const sinStock =
        productos.filter(
            producto =>
                Number(producto.cantidad) === 0
        ).length;

        document.getElementById(
            "total-productos"
        ).textContent = totalProductos;

        document.getElementById(
            "stock-total"
        ).textContent = stockTotal;

        document.getElementById(
            "poco-stock"
        ).textContent = pocoStock;

        document.getElementById(
            "sin-stock"
        ).textContent = sinStock;

    const tabla =
        document.getElementById(
            "tabla-productos"
        );
    tabla.innerHTML = "";

    const textoBusqueda =
        document
            .getElementById("busqueda")
            .value
            .toLowerCase();
        
    productos.filter(
        producto =>
            producto.nombre
                .toLowerCase()
                .includes(textoBusqueda)
    )
    .forEach(
        producto =>{
            let estado ="";

            if(
                Number(producto.cantidad) === 0
            ){
                estado =
                    "🔴 Sin stock";
            }

            else if(
                Number(producto.cantidad) < 5
            ){
                estado=
                    "🟠 Poco stock";
            }
            else{
                estado =
                    " 🟢 En stock";
            }
            tabla.innerHTML += `

            <tr>
                <td>
                    ${producto.nombre}
                </td>

                <td>
                    ${producto.categoria}
                </td>

                <td>
                    ${producto.cantidad}
                </td>

                <td>
                    $${Number(
                        producto.precio
                    ).toLocaleString()}
                </td>

                <td>
                    $${Number(
                        producto.venta
                    ).toLocaleString()}
                </td>

                <td>
                    ${estado}
                </td>

                <td>
                    <button onclick="editarProducto('${producto._id}')">
                        ✏️
                    </button>

                    <button onclick="eliminarProducto('${producto._id}')">
                        🗑️
                    </button>
                </td>
            </tr>
            `;
        }
    );

    console.log(productos);
}

async function eliminarProducto(id) {
    const confirmar =
        confirm(
            "Deseas eliminar este producto?"
        );


        if(!confirmar){
            return;
        }

        await fetch(
             `/productos/${id}`,
            {
                method:"DELETE"
            }
        );

      cargarProductos()   
}

async function  editarProducto(id) {
    console.log("Editar:", id);

    const respuesta =
        await fetch("/productos");

    const productos = 
        await respuesta.json();

    const producto =
        productos.find(
            p => p._id === id
        );

    if(!producto){
        return;
    
    }

    productoEditando =id;
    document.getElementById(
        "nombre"
    ).value =
        producto.nombre;

    document.getElementById(
        "categoria"
    ).value =
        producto.categoria;

    document.getElementById(
        "cantidad"
    ).value =
       producto.cantidad;

    document.getElementById(
        "compra"
    ).value =
        producto.precio;

    document.getElementById(
       "venta"
    ).value =
        producto.venta;

    document.getElementById(
        "guardar-producto"
    ).textContent =
        "Actualizar";

    modal.style.display =
        "flex";

    console.log("ID del producto:", producto._id);
}

document
.getElementById("busqueda")
.addEventListener(
    "input",
    cargarProductos
);

cargarProductos();

window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;