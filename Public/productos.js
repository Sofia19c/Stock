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

    await fetch(
        "/productos",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                nombre, 
                categoria,
                cantidad,
                precio: compra,
                venta
            })
        }
    );

    modal.style.display=
        "none";

    cargarProductos(); 
}

async function cargarProductos() {
    const respuesta =
        await fetch(
            "/productos"
        );

    const productos =
        await respuesta.json();

    const tabla =
        document.getElementById(
            "tabla-productos"
        );
    tabla.innerHTML = "";

    productos.forEach(
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
                    ✏️

                    🗑️
                </td>
            </tr>
            `;
        }
    );

    console.log(productos);
}

cargarProductos();