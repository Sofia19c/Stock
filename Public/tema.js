async function aplicarTema(){

    try{

        const respuesta =
            await fetch("/configuraciones");

        const configuracion =
            await respuesta.json();

        document.body.classList.toggle(
            "dark",
            configuracion.tema === "oscuro"
        );

    }

    catch(error){

        console.log("Error cargando tema", error);

    }

}

aplicarTema();