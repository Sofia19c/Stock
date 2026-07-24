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

    const configuracion =
        await respuesta.json();

    if(respuesta.ok){

        mostrarToast(
            "Configuración guardada correctamente",
            "success"
        );

    }

    else{

        mostrarToast(
            configuracion.mensaje,
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
        configuracion.nombre || "";

    document.getElementById(
        "propietario"
    ).value =
        configuracion.propietario || "";

    document.getElementById(
        "telefono"
    ).value =
        configuracion.telefono || "";

    document.getElementById(
        "correo"
    ).value =
        configuracion.correo || "";

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

document
    .getElementById("exportar")
    .addEventListener(
        "click",
        exportarBackup
    );
function exportarBackup(){

    window.location.href =
        "/backup/exportar";

}

document
    .getElementById("importar")
    .addEventListener(
        "click",
        ()=>{

            document
                .getElementById(
                    "archivo-backup"
                )
                .click();

        }
    );
document
    .getElementById("archivo-backup")
    .addEventListener(
        "change",
        leerBackup
    );

async function leerBackup(e){

    const archivo =
        e.target.files[0];

    if(!archivo){
        return;
    }

    const texto =
        await archivo.text();

    const backup =
        JSON.parse(texto);

    const respuesta =
    await fetch(
        "/backup/restaurar",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(
                backup
            )

        }
    );

const datos =
    await respuesta.json();

console.log(datos);

}
cargarConfiguracion();
