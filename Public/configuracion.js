const botonGuardar = 
    document.getElementById(
        "guardar-configuracion"
    );

botonGuardar.addEventListener(
    "click",
    guardarConfiguracion
);

cargarConfiguracion();

function guardarConfiguracion(){
    const configuracion = {
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
    };

    localStorage.setItem(
        "configuracion",
        JSON.stringify(configuracion)
    );

    mostrarToast(
        "configuracion guardada correctamente",
        "sucess"
    );
}

function cargarConfiguracion(){

    const datos =
        JSON.parse(
            localStorage.getItem("configuracion")
        );

    if(!datos){
        return;
    }

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
