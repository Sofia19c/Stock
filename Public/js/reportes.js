async function descargarInventario() {
    window.location.href =
        "/reportes/inventario";
}

async function descargarInventario() {
    window.location.href = "/reportes/inventario";
}

async function descargarPocoStock() {
    window.location.href = "/reportes/poco-stock";
}

async function descargarReservas() {
    window.location.href = "/reportes/reservas";
}

async function descargarInversiones() {
    window.location.href = "/reportes/inversiones";
}

async function cargarResumen(){
    const respuesta =
        await fetch("/reportes/resumen");

    const resumen =
        await respuesta.json();

    document.getElementById(
        "valor-inventario"
    ).textContent =
        "$" +
        Number(
            resumen.valorInventario
        ).toLocaleString();

    document.getElementById(
        "total-productos"
    ).textContent =
        resumen.totalProductos;
    
    document.getElementById(
        "total-reservas"
    ).textContent =
        resumen.totalReservas;

    document.getElementById(
        "total-invertido"
    ).textContent =
        "$" +
        Number(
            resumen.totalInvertido
        ).toLocaleString();
}

let graficaCategorias;
let graficaStock;

async function cargarGraficas() {
    
    const respuesta =
        await fetch("/reportes/graficas");

    const datos =
        await respuesta.json();

    const categorias =
        Object.keys(datos.categorias);

    const cantidades =
        Object.values(datos.categorias);

    
    if(graficaCategorias){
        graficaCategorias.destroy();
    }

    graficaCategorias = new Chart(

    document.getElementById("graficaCategorias"),

    {

        type:"doughnut",

        data:{

            labels:categorias,

            datasets:[{

                data:cantidades,

                backgroundColor:[
                    "#4F46E5",
                    "#16A34A",
                    "#F97316",
                    "#EF4444",
                    "#06B6D4",
                    "#EAB308"
                ],

                borderWidth:2

            }]

        },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                cutout:"55%",

                plugins:{

                    legend:{

                        position:"top",

                        labels:{

                            boxWidth:18,

                            padding:15,

                            font:{
                                size:13
                            }

                        }

                    }

                }

            }

        }

    );

    if(graficaStock){
        graficaStock.destroy();
    }

    graficaStock =
        new Chart(
            document.getElementById("graficaStock"),
            {

                type:"bar",
                
                data:{
                    
                    labels:[
                        "En Stock",
                        "Poco Stock",
                        "Sin Stock",
                    ],

                    datasets:[{
                        label:"Productos",
                        data:[
                            datos.estado.enStock,
                            datos.estado.pocoStock,
                            datos.estado.sinStock
                        ],

                        backgroundColor:[
                            "#22C55E",
                            "#F97316",
                            "#EF4444"
                        ]
                    }]
                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            position:"top",

                            labels:{

                                font:{
                                    size:13
                                }

                            }

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            ticks:{
                                precision:0,
                                font:{
                                    size:12
                                }
                            }

                        },

                        x:{

                            ticks:{
                                font:{
                                    size:13
                                }
                            }

                        }

                    }

                }
            }
        );
}

cargarGraficas();
cargarResumen();