//const reserva = require("../models/reserva");

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

async function cargarReservas(){

    const respuesta =
        await fetch("/reservas");

    const reservas =
        await respuesta.json();

    document.getElementById(
        "total-reservas"
    ).textContent =
        reservas.filter(
            r => r.estado === "Reservada"
        ).length;

    document.getElementById(
        "total-entregadas"
    ).textContent =
        reservas.filter(
            r => r.estado === "Entregada"
        ).length;

    document.getElementById(
        "total-canceladas"
    ).textContent =
        reservas.filter(
            r => r.estado === "Cancelada"
        ).length;

    //aqui la tarjeta se actualiza automaticamente 
    const totalProductos =
        reservas
            .filter(
                reserva =>
                    reserva.estado === "Reservada"
            )
            .reduce(
                (acc, reserva) =>
                    acc + Number(reserva.cantidad),
                0
            );
    document.getElementById(
        "total-productos"
    ).textContent =
        totalProductos;

    const tabla =
        document.getElementById(
            "tabla-reservas"
        );

    tabla.innerHTML="";

    reservas.forEach(
        reserva=>{

            tabla.innerHTML +=`

            <tr>

                <td>${reserva.cliente}</td>

                <td>${reserva.producto}</td>

                <td>${reserva.cantidad}</td>

                <td>

                    ${
                        new Date(
                            reserva.fecha
                        ).toLocaleDateString()
                    }

                </td>

                <td>

                    ${reserva.estado}

                </td>

                <td>

                    <button
                        onclick="entregarReserva('${reserva._id}')"
                    >
                        ✅
                    </button>

                    <button
                        class="btn-cancelar"
                        onclick="cancelarReserva('${reserva._id}')"
                        title="Cancelar"
                    >
                        ❌
                    </button>

                    <button
                        onclick="eliminarReserva('${reserva._id}')"
                    >
                        🗑️
                    </button>

                </td>

            </tr>

            `;

        }
    );

    const productos = {};

    //aqui se suman la cantidad de productos reservados en un diccionario llamado productos
    reservas.forEach(
        reserva => {
            if(
                //Aqui se recorre la lista de reservas uno por uno 
                reserva.estado ===
                "Reservada"
            ){
                if(
                    !productos[
                    reserva.producto
                    ]
                ){
                   productos[
                    reserva.producto
                   ] = 0;
                }
                productos[
                        reserva.producto
                    ] += Number(
                        reserva.cantidad
                    );

                
            }
        }
    );

    const nombresProductos = 
        Object.keys(productos);

    const cantidades =
        Object.values(productos);

    //creamos la grafica

    const ctx = 
        document.getElementById(
            "graficaReservas"
        );
    
    const gradient =
        ctx.getContext("2d")
            .createLinearGradient(
                0,
                0,
                0,
                250
            );
    gradient.addColorStop(
        0,
        "#818cf8"
    );

    gradient.addColorStop(
        1,
        "#4f46e5"
    );

    if(graficaReservas){
        graficaReservas.destroy();
    }

    graficaReservas =
        new Chart(
            ctx,
            {
                type:"bar",

                data:{
                    labels:
                        nombresProductos,

                    datasets:[{
                        data:
                            cantidades,
                        
                        backgroundColor:
                            gradient,
                        
                        borderRadius:19
                    }]
                },

                options:{
                    responsive:true,
                    maintainAspectRatio:false,

                    plugins:{
                        legend:{
                            display:false
                        }
                    },

                    scales:{
                        y:{
                            beginAtZero:true
                        }
                    }
                }
            }
        );

    const reservadas = 
        reservas.filter(
            r => 
                r.estado ===
                "Reservada"
        ).length;

    const entregadas = 
        reservas.filter(
            r => 
                r.estado ===
                "Entregada"
        ).length;

    const canceladas =
        reservas.filter(
            r => 
                r.estado ===
                "Cancelada"
        ).length;

    const ctxEstado =
        document.getElementById(
            "graficaEstado"
        );

    if(graficaEstado){
        graficaEstado.destroy();
    }

    graficaEstado = 
        new Chart(
            ctxEstado,
            {
                type:"doughnut",

                data:{
                    labels:[
                        "Reservadas",
                        "Entregadas",
                        "Canceladas"
                    ],

                    datasets:[{

                        data:[
                            reservadas,
                            entregadas,
                            canceladas
                        ],

                        backgroundColor:[
                            "#f59e0b",
                            "#22c55e",
                            "#ef4444"
                        ],
                        borderWidth:0

                    }]
                },

                options:{
                    responsive:true,
                    maintainAspectRatio:false,
                    plugins:{
                        legend:{
                            position:"bottom"
                        }
                    }
                }
            }
        );
}

async function eliminarReserva(id) {

    const confirmar =
        confirm(
            "¿Deseas eliminar esta reserva?"
        );

        if(!confirmar){
            return;
        }

        await fetch(
            `/reservas/${id}`,
            {
                method:"DELETE"
            }
        );

        cargarReservas();
}

async function entregarReserva(id){

    await fetch(
        `/reservas/${id}`,
        {
            method:"PATCH"
        }
    );

    cargarReservas();
}

async function cancelarReserva(id) {
    await fetch(
        `/reservas/cancelar/${id}`,

        {
            method:"PATCH"
        }
    );

    cargarReservas();
}

cargarReservas();
cargarProductosModal();