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

    select.innerHTML += `
        <option value="OTRO">
            Otro...
        </option>
    `;
}

let graficaInversiones = null;

async function  cargarInversiones() {
    const respuesta =
        await fetch("/inversiones");

    const inversiones =
        await respuesta.json();

    const nombresProductos =
        inversiones.map(
            inversion => 
                inversion.producto
        );

    const valoresInvertidos =
        inversiones.map(
            inversion =>
                Number(
                    inversion.invertido
                )
        );

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
                    ${
                        inversion.tipo ===
                        "Gasto"
                        ? "💸 Gasto"
                        : "📦 Inventario"
                    }
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
                    <button
                        onclick ="eliminarInversion('${inversion._id}')"
                    >
                        🗑️
                    </button>
                </td>

            </tr>
            `;
        }
    );

    //aqui obtiene el elemento HTML (graficaInversiones) y lo guarda en ctx
    const ctx = 
        document.getElementById(
            "graficaInversiones"
        );
    //Aqui verifica si ya habia una grafica existente, de ser asi, destruyala
    if(graficaInversiones){
        graficaInversiones.destroy();
    }

    //crea una instancia de Chart, ctx indica dibujar la grafica
    // y el otro parametro es la configuracion de la tabla (,)
    graficaInversiones = 
        new Chart(ctx,{
            //tipo de tabla barras
            type:"bar",

            data:{

                labels:
                    nombresProductos, 

                datasets:[{
                    label:
                        "Valor Invertido",

                    data:
                        valoresInvertidos,
                    
                    background:
                        "#4f46e5",
                    
                    borderRadius:
                        8
                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio: false,

                plugins:{
                    legend:{
                        display:false
                    }
                }
            }
        });
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

const selectProducto =
    document.getElementById(
        "producto"
    );

const inputOtro =
    document.getElementById(
        "producto-otro"
    );

selectProducto.addEventListener(
    "change",
    () => {
        if(
            selectProducto.value ===
            "OTRO"
        ){
            inputOtro.style.display =
                "block";
        }
        else{
            inputOtro.style.display =
                "none";
        }
    }
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
       let producto =
    document.getElementById(
        "producto"
    ).value;

        let tipo =
            "Inventario";

        if(producto === "OTRO"){
            producto =
                document.getElementById(
                    "producto-otro"
                ).value
            
            tipo =
                "Gasto";
        }
        
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
                    "content-Type":"application/json"
                },

                body:JSON.stringify({
                    producto,
                    tipo,
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
            "invertido"
        ).value = "";
        
        document.getElementById(
            "recuperado"
        ).value = "";

        document.getElementById(
            "producto-otro"
        ).value = "";

        cargarProductosModal();
        cargarInversiones();
    }
);

cargarInversiones();
async function eliminarInversion(id) {
    //ventana emergente de confirmación al usuario
    const confirmar =
        confirm(
            "¿Deseas eliminar esta inversion?"
        );

        if(!confirmar){
            return;
        }

        //llama la función fetch()para hacer una petición HTTP
        //await hace que la función esepere hasta que la petición termine antes de continuar
        await fetch(
            //Define la URL a la que se enviará la petición
            `/inversiones/${id}`,
            {
                //configuracion de la peticion HTTP
                method:"DELETE"
            }
        );

        cargarInversiones();
}
cargarProductosModal();





