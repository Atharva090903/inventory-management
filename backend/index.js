const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve JSON files
app.get('/api/inventory', (req, res) => {
    const inventory = readJsonFile('./inventory.json');
    res.json(inventory);
});

app.get('/api/cart', (req, res) => {
    const cart = readJsonFile('./cart.json');
    res.json(cart);
});

// Helper functions to read/write JSON files
const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API to add an item to the inventory
app.post('/api/addItemToInventory', (req, res) => {
    console.log('Received request to add item:', req.body);
    const { productId, productName, price, quantity } = req.body;
    const inventory = readJsonFile('./inventory.json');
    inventory[productId] = { productName, price, quantity };
    writeJsonFile('./inventory.json', inventory);
    console.log('Updated inventory:', inventory);
    res.send({ message: 'Item added to inventory' });
});

// API to remove an item from the inventory
app.post('/api/removeItemFromInventory', (req, res) => {
    console.log('Received request to remove item:', req.body);
    const { productId } = req.body;
    const inventory = readJsonFile('./inventory.json');
    delete inventory[productId];
    writeJsonFile('./inventory.json', inventory);
    console.log('Updated inventory:', inventory);
    res.send({ message: 'Item removed from inventory' });
});

// API to add an item to the cart
app.post('/api/addItemToCart', (req, res) => {
    console.log('Received request to add item to cart:', req.body);
    const { customerId, productId, quantity } = req.body;
    const inventory = readJsonFile('./inventory.json');
    const cart = readJsonFile('./cart.json');

    if (!inventory[productId] || inventory[productId].quantity < quantity) {
        return res.status(400).send({ message: 'Item not available in inventory' });
    }

    if (!cart[customerId]) {
        cart[customerId] = {};
    }

    if (cart[customerId][productId]) {
        cart[customerId][productId].quantity += quantity;
    } else {
        cart[customerId][productId] = { quantity, price: inventory[productId].price };
    }

    inventory[productId].quantity -= quantity;
    writeJsonFile('./inventory.json', inventory);
    writeJsonFile('./cart.json', cart);

    console.log('Updated cart:', cart);
    res.send({ message: 'Item added to cart' });
});

// API to remove an item from the cart
app.post('/api/removeItemFromCart', (req, res) => {
    console.log('Received request to remove item from cart:', req.body);
    const { customerId, productId } = req.body;
    const cart = readJsonFile('./cart.json');
    
    if (cart[customerId] && cart[customerId][productId]) {
        delete cart[customerId][productId];
        writeJsonFile('./cart.json', cart);
        console.log('Updated cart:', cart);
        res.send({ message: 'Item removed from cart' });
    } else {
        res.status(404).send({ error: 'Item not found in cart' });
    }
});


// API to calculate discounted price
app.post('/api/applyDiscountCoupon', (req, res) => {
    console.log('Received request to apply discount:', req.body);
    const { cartValue, discountId } = req.body;
    const coupons = readJsonFile('./coupons.json');
    const coupon = coupons[discountId];

    if (!coupon) {
        return res.status(400).send({ message: 'Invalid discount coupon' });
    }

    const discountAmount = Math.min((coupon.discountPercentage / 100) * cartValue, coupon.maxDiscount);
    const discountedPrice = cartValue - discountAmount;

    console.log('Discount applied. Original price:', cartValue, 'Discounted price:', discountedPrice);
    res.send({ discountedPrice });
});

// Serve frontend HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/cart.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
