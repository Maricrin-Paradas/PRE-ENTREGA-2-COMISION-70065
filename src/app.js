import express from "express"
import productsRouter from "./routes/products.router.js"
import handlebars from "express-handlebars"
import cartRouter from "./routes/carts.router.js"
import __dirname from "./utils.js"
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io"
import fs from "fs"
import guardarProducto from "./utils/utils.js"

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configurar handlebars para leer el contenido de los endpooint
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname, + '/public'))

// Rutas
app.use("/api", cartRouter);
app.use("/api", productsRouter);
app.use("/", viewsRouter);

let products = [];

// Función para cargar productos desde el archivo
const loadProducts = () => {
    try {
        const data = fs.readFileSync("./products.json", "utf8");
        products = JSON.parse(data);
    } catch (err) {
        console.error("Error reading products file:", err);
        products = [];
    }
};

// Cargar productos al inicio
loadProducts();

// Iniciar servidor HTTP
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const socketServer = new Server(httpServer);

// Manejo de eventos de socket
socketServer.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("productListServer", products);

    socket.on("CargarProduct", (info) => {
        guardarProducto(info);
        loadProducts(); // Recargar productos desde el archivo
        socket.emit("clean", products);
        socket.emit("productListServer", products);
    });

    socket.on("eliminarProducto", (data) => {
        console.log('Remove product:', data);
        const idProduct = data.id;
        products = products.filter(p => p.id !== idProduct);
        try {
            fs.writeFileSync("./products.json", JSON.stringify(products, null, 2));
            socket.emit("clean", products);
            socket.emit("productListServer", products);
        } catch (err) {
            console.error("Error writing products file:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
