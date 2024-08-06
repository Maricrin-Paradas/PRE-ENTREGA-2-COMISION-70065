const socket = io();

// Función para crear un elemento de producto
function crearElementoProducto(producto) {
    const divProducto = document.createElement('div');
    divProducto.classList.add('productosHome');

    const propiedades = [
        { etiqueta: 'Id', valor: producto.id },
        { etiqueta: 'Titulo', valor: producto.title },
        { etiqueta: 'Descripcion', valor: producto.description },
        { etiqueta: 'Codigo', valor: producto.code },
        { etiqueta: 'Precio', valor: `$${producto.price}` },
        { etiqueta: 'Status', valor: producto.status },
        { etiqueta: 'Stock', valor: producto.stock },
        { etiqueta: 'Categoria', valor: producto.category },
        { etiqueta: 'Imagen', valor: producto.thumbnails }
    ];

    propiedades.forEach(prop => {
        const p = document.createElement('p');
        p.textContent = `${prop.etiqueta}: ${prop.valor}`;
        divProducto.appendChild(p);
    });

    const buttonProduct = document.createElement("button");
    buttonProduct.textContent = "Eliminar";
    buttonProduct.classList.add(`borrarBtn${producto.id}`);
    buttonProduct.onclick = function() {
        console.log(`Se hizo clic en el botón con ID ${producto.id}`);
        borrarProducto(producto.id);
    };

    divProducto.appendChild(buttonProduct);

    return divProducto;
}

// Mostrar productos al recibir la lista
socket.on("productListServer", products => {
    const contenedorProductos = document.querySelector("#product-list");

    // Limpiar el contenedor antes de agregar nuevos productos
    contenedorProductos.innerHTML = '';

    products.forEach(producto => {
        const divProducto = crearElementoProducto(producto);
        contenedorProductos.appendChild(divProducto);
    });
});

// Manejo del formulario para agregar productos
document.querySelector("#FormularioProduct").addEventListener("submit", (e) => {
    e.preventDefault();
    const info = {
        title: document.querySelector("#title").value,
        description: document.querySelector("#description").value,
        code: document.querySelector("#code").value,
        price: document.querySelector("#price").value,
        status: document.querySelector("#status").value,
        stock: document.querySelector("#stock").value,
        category: document.querySelector("#category").value
    };

    if (Object.values(info).some(value => value === "")) {
        console.log("Algunos datos están vacíos");
    } else {
        socket.emit("CargarProduct", info);
    }

    e.target.reset(); // Utiliza e.target para el formulario
});

// Función para eliminar un producto
function borrarProducto(id) {
    socket.emit('eliminarProducto', { id });
}

// Manejo de limpieza de productos
socket.on("clean", () => {
    console.log("Borrar lista");
    const contenedorProductos = document.querySelector("#product-list");
    if (contenedorProductos) {
        contenedorProductos.innerHTML = '';
        console.log("Lista borrada");
    } else {
        console.log("No se encontró el contenedor de productos");
    }
});
