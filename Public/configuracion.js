const botonGuardar = 
    document.getElementById(
        "guardar-configuracion"
    );

botonGuardar.addEventListener(
    "click",
    guardarConfiguracion
);

cargarConfiguracion();

async function guardarConfiguracion(){

    const respuesta =
        await fetch(
            "/configuraciones",
            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    nombre:
                        document.getElementById(
                            "nombre-negocio"
                        ).value,

                    propietario:
                        document.getElementById(
                            "propietario"
                        ).value,

                    telefono:
                        document.getElementById(
                            "telefono"
                        ).value,

                    correo:
                        document.getElementById(
                            "correo"
                        ).value

                })

            }
        );

    const datos =
        await respuesta.json();

    if(respuesta.ok){

        mostrarToast(
            "Configuración guardada correctamente",
            "success"
        );

    }

    else{

        mostrarToast(
            datos.mensaje,
            "error"
        );

    }

}

async function cargarConfiguracion(){

    const respuesta =
        await fetch("/configuraciones");
    
    const configuracion =
        await respuesta.json();

    document.getElementById(
        "nombre-negocio"
    ).value =
        datos.nombre || "";

    document.getElementById(
        "propietario"
    ).value =
        datos.propietario || "";

    document.getElementById(
        "telefono"
    ).value =
        datos.telefono || "";

    document.getElementById(
        "correo"
    ).value =
        datos.correo || "";

}

function mostrarToast(mensaje,tipo="success"){

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

cargarConfiguracion();
