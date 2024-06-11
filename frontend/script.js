document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('addItemForm')) {
        document.getElementById('addItemForm').addEventListener('submit', addItemToInventory);
        loadInventory();
    }

    if (document.getElementById('inventory') && document.getElementById('cart')) {
        loadInventory();
        loadCart();
    }
});

async function addItemToInventory(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;

    const response = await fetch('/api/addItemToInventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, productName, price, quantity })
    });

    const data = await response.json();
    console.log('Response from server:', data);
    loadInventory();
}

async function removeItemFromInventory(productId) {
    const response = await fetch('/api/removeItemFromInventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
    });

    const data = await response.json();
    console.log('Response from server:', data);
    loadInventory();
}

async function loadInventory() {
    const response = await fetch('/api/inventory');
    const inventory = await response.json();
    const inventoryDiv = document.getElementById('inventory');

    inventoryDiv.innerHTML = '<h2>Inventory</h2>';
    for (const [productId, { productName, price, quantity }] of Object.entries(inventory)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <div>
                <strong>${productName}</strong><br>
                Price: ${price}<br>
                Quantity: ${quantity}
            </div>
            <button onclick="removeItemFromInventory('${productId}')">Remove</button>
        `;
        inventoryDiv.appendChild(itemDiv);
    }
}

async function loadCart() {
    const customerId = 'customer1';  // Hardcoded for simplicity
    const response = await fetch('/api/cart');
    const cart = await response.json();
    const cartDiv = document.getElementById('cart');
    const inventoryDiv = document.getElementById('inventory');
    const inventoryResponse = await fetch('/api/inventory');
    const inventory = await inventoryResponse.json();

    cartDiv.innerHTML = '<h2>Cart</h2>';
    let totalPrice = 0;
    for (const [productId, { quantity, price }] of Object.entries(cart[customerId] || {})) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <div>
                <strong>${inventory[productId].productName}</strong><br>
                Price: ${price}<br>
                Quantity: ${quantity}
            </div>
            <button onclick="removeItemFromCart('${productId}')">Remove</button>
        `;
        cartDiv.appendChild(itemDiv);
        totalPrice += quantity * price;
    }

    document.getElementById('totalPrice').textContent = totalPrice;

    inventoryDiv.innerHTML = '<h2>Inventory</h2>';
    for (const [productId, { productName, price, quantity }] of Object.entries(inventory)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <div>
                <strong>${productName}</strong><br>
                Price: ${price}<br>
                Quantity: ${quantity}
            </div>
            <button onclick="addItemToCart('${productId}', ${price})">Add to Cart</button>
        `;
        inventoryDiv.appendChild(itemDiv);
    }
}

async function addItemToCart(productId, price) {
    const customerId = 'customer1';  // Hardcoded for simplicity
    const quantity = 1;  // Hardcoded for simplicity

    const response = await fetch('/api/addItemToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, productId, quantity })
    });

    const data = await response.json();
    console.log('Response from server:', data);
    loadCart();
}

async function removeItemFromCart(productId) {
    const customerId = 'customer1';  // Hardcoded for simplicity
    const cartResponse = await fetch('/api/cart');
    const cart = await cartResponse.json();
    const inventoryResponse = await fetch('/api/inventory');
    const inventory = await inventoryResponse.json();

    const quantity = cart[customerId][productId].quantity;
    delete cart[customerId][productId];
    inventory[productId].quantity += quantity;

    await fetch('/api/removeItemFromInventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
    });

    await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
    });

    await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventory)
    });

    loadCart();
}

async function applyDiscount() {
    const discountId = document.getElementById('discountId').value;
    const totalPrice = parseFloat(document.getElementById('totalPrice').textContent);

    const response = await fetch('/api/applyDiscountCoupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartValue: totalPrice, discountId })
    });

    const data = await response.json();
    console.log('Response from server:', data);
    const { discountedPrice } = data;
    document.getElementById('totalPrice').textContent = discountedPrice;
}
