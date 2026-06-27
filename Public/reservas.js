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
cargarProductosModal();