let graficaReservas = null;
let graficaEstado = null;

async function cargarProductosModal(){
    
    const respuesta = 
        await fetch ("/productos");

    const productos = 
        await respuesta.json();

    const select =
        document.getElementById(
            "producto"
        );
    
    select.innerHTML ="";

    productos.forEach(
        producto =>{
            select.innerHTML += `
                <option>
                    ${producto.nombre}
                </option>
             `;
        }  
    );
}

const botonNueva =
    document.querySelector(
        ".btn-nueva"
    );

const modal =
    document.getElementById(
        "modal-reserva"
    );

const botonGuardar =
    document.getElementById(
        "guardar-reserva"
    );

    botonGuardar.addEventListener(
        "click",
        guardarReserva
    );

botonNueva.addEventListener(
    "click",
    () =>{
        modal.style.display =
            "flex";
    }
);

modal.addEventListener(
    "click",
    (e) => {

        if(e.target === modal){
            modal.style.display =
                "none";
        }
    }
);

async function guardarReserva(){
    const cliente =
        document.getElementById (
            "cliente"
        ).value;

    const producto = 
        document.getElementById(
            "producto"
        ).value;

    const cantidad =
        Number(
            document.getElementById(
                "cantidad"
            ).value
        );
    
    if(
        !cliente ||
        !producto ||
        !cantidad
    ){
        alert(
            "Completa todos los campos."
        );

        return;
    }

    await fetch(
        "/reservas",
        {
            method: "POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                cliente, 
                producto,
                cantidad
            })
        }
    );

    modal.style.display =
        "none";
    
    document.getElementById(
        "cliente"
    ).value = "";

    document.getElementById(
        "cantidad"
    ).value = "";

    cargarReservas();
}

async function cargarReservas() {

    const respuesta = 
        await fetch(
            "/reservas"
        );

    const reservas = 
        await respuesta.json();

    console.log(reservas);
}

cargarReservas();
cargarProductosModal();