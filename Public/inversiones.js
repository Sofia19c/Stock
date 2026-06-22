async function cargarProductosModal() {
    const respuesta =
        await fetch("/productos");
    
    const productos =
        await respuesta.json();

    console.log(productos);

    const select = 
        document.getElementById(
            "producto"
        );
    
    select.innerHTML = `
        <option value ="">
            selecciona un producto
        </option>
    `;

    productos.forEach(
        producto => {

            select.innerHTML +=  `
                <option value="${producto.nombre}">
                    ${producto.nombre}
                </option>
            `;
        }
    );
}

async function  cargarInversiones() {
    const respuesta =
        await fetch("/inversiones");

    const inversiones =
        await respuesta.json();

    const totalInvertido =
        inversiones.reduce(
            (acc, i) => 
                acc + Number(i.invertido),
            0
        );

    const totalRecuperado =
        inversiones.reduce(
            (acc, i) =>
                acc + Number(i.recuperado),
            0
        );

    const activas = 
        inversiones.filter(
            i =>
                Number(i.recuperado) <
                Number(i.invertido)
        ).length;
    
    const roi =
        totalInvertido > 0
        ? (
            (
                totalRecuperado - totalInvertido
            )
            /
            totalInvertido
        )* 100
    :0;
    
    document.getElementById(
        "total-invertido"
    ).textContent =
        `$${totalInvertido.toLocaleString()}`;
    
    document.getElementById(
    "total-recuperado"
    ).textContent =
        `$${totalRecuperado.toLocaleString()}`;

    document.getElementById(
        "total-activas"
    ).textContent =
        activas;

    document.getElementById(
        "roi-promedio"
    ).textContent =
        `${roi.toFixed(1)}%`

    const tabla = 
        document.getElementById(
            "tabla-inversiones"
        );
    tabla.innerHTML = "";

    inversiones.forEach(
        inversion => {
            const ganancia =
                Number(
                    inversion.recuperado
                )
                -
                Number(
                    inversion.invertido
                );
            
            const estado =
                Number(
                    inversion.recuperado
                ) >=

                Number(
                    inversion.invertido
                )
                ? "✅ Recuperado"
                : "🟠 Pendiente";
            
            tabla.innerHTML += `
            <tr>

                <td>
                    ${inversion.producto}
                </td>

                <td>
                    $${Number(
                        inversion.invertido
                    ).toLocaleString()}
                </td>

                <td>
                    $${Number(
                        inversion.recuperado
                    ).toLocaleString()}
                </td>

                <td>
                    $${ganancia.toLocaleString()}
                </td>

                <td>
                    ${estado}
                </td>

                <td>
                    🗑️
                </td>

            </tr>
            `;
        }
    );
}

cargarInversiones();

const botonNueva =
    document.querySelector(
        ".btn-nueva"
    );

const modal =
    document.getElementById(
        "modal-inversion"
    );

botonNueva.addEventListener(
    "click",
    () => {

        modal.style.display =
            "flex";

    }
);

modal.addEventListener(
    "click",
    (e) => {
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
    "guardar-inversion"
);

botonGuardar.addEventListener(
    "click",
    async () => {
        const producto = 
            document.getElementById(
                "producto"
            ).value;

        const invertido =
            document.getElementById(
                "invertido"
            ).value;
        
        const recuperado =
            document.getElementById(
                "recuperado"
            ).value;

        if(
            !producto ||
            !invertido
        ){
            alert(
                "completa todos los campos"
            );
            return;
        }

        await fetch(
            "/inversiones",
            {
                method:"POST",

                headers:{
                    "content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    producto,
                    invertido,
                    recuperado
                })
            }
        );

        modal.style.display =
            "none";
        
        document.getElementById(
            "producto"
        ).value = "";
        
        document.getElementById(
            "recuperado"
        ).value = "";

        cargarProductosModal();
    }
);

cargarInversiones();
cargarProductosModal();




