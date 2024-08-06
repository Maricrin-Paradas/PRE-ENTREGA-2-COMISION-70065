import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Crear una instancia del enrutador de Express
const router = express.Router();

// Obtener el nombre del archivo actual y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajusta la ruta para apuntar al archivo en el directorio raíz
const cartsPath = path.join(__dirname, '../../carts.json');

// Cargar carritos desde el archivo
let carts = [];

try {
    const data = fs.readFileSync(cartsPath, 'utf8');
    carts = JSON.parse(data);
} catch (error) {
    console.error('Error reading carts file:', error);
}

// Definir las rutas
router.get('/carts', (req, res) => {
    res.json(carts);
});

router.get('/carts/:id', (req, res) => {
    const cartId = parseInt(req.params.id, 10);
    console.log(`Searching for cart with ID: ${cartId}`); // Debugging line
    const carts = loadCarts();
    const cart = carts.find(c => c.id === cartId);

    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
});

// Exportar el enrutador
export default router;
