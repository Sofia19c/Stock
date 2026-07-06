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

    console.log(productos);
}

cargarProductos();