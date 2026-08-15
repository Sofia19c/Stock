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

    const cantidadValor =
        document.getElementById("cantidad").value;

    const cantidad = cantidadValor === ""
        ? 0
        : Number(cantidadValor);

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
        mostrarToast(
        "Completa todos los campos",
        "warning"
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

    console.log(
        "Datos enviados:",
        JSON.stringify({
            nombre,
            categoria,
            cantidad,
            compra,
            venta
        })
    );
   // Enviar datos al servidor
const respuesta = await fetch(
    "http://localhost:3000" + url,
    {
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
    }
);

const datos = await respuesta.json();

if(respuesta.ok){

    mostrarToast(
        productoEditando
            ? "✅ Producto actualizado correctamente"
            : "✅ Producto agregado correctamente",
        "success"
    );

}else{

    mostrarToast(
        datos.mensaje || "❌ Ocurrió un error",
        "error"
    );

    return;
}

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

    const totalVentas = productos.reduce(
        (total, producto) => 
            total +
            (
                Number(producto.productosVendidos || 0) *
                Number(producto.venta || 0)
            ),
        0
    );

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

    const categoriaSeleccionada =
        document    
            .getElementById("filtro-categoria")
            .value;
        
    productos.filter(
        producto => {
            const coincideNombre =
                producto.nombre
                    .toLowerCase()
                    .includes(textoBusqueda);
            
            const totalVenta =
                Number(producto.venta || 0) *
                Number(producto.productosVendidos || 0);

            const coincideCategoria =
                categoriaSeleccionada === "" || 
                producto.categoria === categoriaSeleccionada;
                
            return(
                coincideNombre && coincideCategoria
            );
        }      
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
                        producto.precio || 0
                    ).toLocaleString()}
                </td>

                <td>
                    $${Number(
                        producto.venta || 0
                    ).toLocaleString()}
                </td>

                <td>
                    ${Number(
                        producto.productosVendidos || 0
                    )}
                </td>

                <td class="${
                    Number(producto.cantidad) === 0
                        ? "stock-sin"
                        : Number(producto.cantidad) < 5
                            ? "stock-bajo"
                            : "stock-ok"
                }">
                    ${estado}
                </td>

                <td class="acciones">

                    <button
                        type="button"
                        onclick="editarProducto('${producto._id}')"
                        title="Editar producto"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        onclick="eliminarProducto('${producto._id}')"
                        title="Eliminar producto"
                    >
                        🗑️
                    </button>

                </td>

            </tr>

            `;
        }
    );

    console.log(productos);
}

async function eliminarProducto(id){

    const confirmar =
        confirm("¿Deseas eliminar este producto?");

    if(!confirmar){
        return;
    }

    const respuesta = await fetch(
        `/productos/${id}`,
        {
            method:"DELETE"
        }
    );

    if(respuesta.ok){

        mostrarToast(
            "🗑️ Producto eliminado correctamente",
            "success"
        );

    }else{

        mostrarToast(
            "❌ Error al eliminar el producto",
            "error"
        );

    }

    cargarProductos();

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
    console.log(
        "PRODUCTO ENCONTRADO:",
        JSON.stringify(producto)
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

document
.getElementById("filtro-categoria")
.addEventListener(
    "change",
    cargarProductos
)

function mostrarToast(mensaje, tipo="success"){

    const toast =
        document.getElementById("toast");

    toast.textContent = mensaje;

    toast.className = "";

    toast.classList.add("mostrar");

    if(tipo==="success"){
        toast.classList.add("toast-success");
    }

    if(tipo==="error"){
        toast.classList.add("toast-error");
    }

    if(tipo==="warning"){
        toast.classList.add("toast-warning");
    }

    setTimeout(()=>{

        toast.classList.remove("mostrar");

    },2500);

}

cargarProductos();

window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;