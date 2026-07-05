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
