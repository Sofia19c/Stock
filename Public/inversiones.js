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
                acc + Number(i.totalRecuperado),
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
                        $${Number}(
                            inversion.invertido
                        ).toLocaleString()}
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


