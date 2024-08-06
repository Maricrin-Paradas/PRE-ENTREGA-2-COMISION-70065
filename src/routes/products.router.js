import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Crear una instancia del enrutador de Express
const router = express.Router();

// Obtener el nombre del archivo actual y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ajusta la ruta para apuntar al archivo en el directorio raíz
const productsPath = path.join(__dirname, '../../products.json');

// Cargar productos desde el archivo
let products = [];

try {
    const data = fs.readFileSync(productsPath, 'utf8');
    products = JSON.parse(data);
} catch (error) {
    console.error('Error reading products file:', error);
}

// Definir las rutas
router.get('/products', (req, res) => {
    res.json(products);
});

router.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const prod = products.find(p => p.id === productId);

    if (prod) {
        res.json(prod);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

router.post('/products', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    let maxId = products.length;
    let i = 1;
    products.forEach(element => {
        let elementID = parseInt(element.id);
        if (elementID > i) {
            maxId = i;
        } else {
            i += 1;
        }
    });

    let productsReverse = products.slice().reverse();
    productsReverse.forEach(element => {
        let elementID = parseInt(element.id);
        if (elementID == maxId) {
            maxId = elementID + 1;
        }
    });

    const newProduct = {
        id: maxId++,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    products.sort((a, b) => a.id - b.id);

    try {
        const pushProducts = JSON.stringify(products, null, 2);
        fs.writeFileSync(productsPath, pushProducts);
        res.status(201).json({ message: 'Product added' });
    } catch (error) {
        console.error('Error writing products file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
