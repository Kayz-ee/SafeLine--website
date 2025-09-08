const stripe = Stripe('pk_test_51S52toJPdJUgS09vdhMrORJpmoloh72SrCREGJRLWM9wIYCAnMfkmpUYbx8akVTrnjB1CqRj6vinClhl9jI62VFc00ldmABXpX'); // Replace with your Stripe Publishable Key

// Product Data - Edit to add products or change availability/prices
const products = [
    {
        id: 1,
        name: 'ABC Water Fire Extinguisher (5L)',
        type: 'Water',
        description: 'Portable water extinguisher for Class A fires. Easy to use.',
        image: 'https://source.unsplash.com/300x200/?fire,extinguisher',
        prices: { USD: 50, GBP: 40, EUR: 45, NGN: 20000 },
        available: true
    },
    {
        id: 2,
        name: 'Foam Fire Extinguisher (9L)',
        type: 'Foam',
        description: 'Effective for flammable liquids and ordinary combustibles.',
        image: 'https://source.unsplash.com/300x200/?foam,fire',
        prices: { USD: 60, GBP: 48, EUR: 55, NGN: 24000 },
        available: true
    },
    {
        id: 3,
        name: 'CO2 Fire Extinguisher (5KG)',
        type: 'CO2',
        description: 'Non-conductive for electrical fires. No residue left behind.',
        image: 'https://source.unsplash.com/300x200/?co2,extinguisher',
        prices: { USD: 70, GBP: 56, EUR: 65, NGN: 28000 },
        available: true
    },
    {
        id: 4,
        name: 'Dry Powder Multi-Purpose (6KG)',
        type: 'Dry Powder',
        description: 'Versatile for multiple fire classes including electrical.',
        image: 'https://source.unsplash.com/300x200/?powder,fire',
        prices: { USD: 55, GBP: 44, EUR: 50, NGN: 22000 },
        available: false
    },
    {
        id: 5,
        name: 'Wet Chemical Kitchen Extinguisher (6L)',
        type: 'Wet Chemical',
        description: 'Specialized for cooking oil fires in kitchens.',
        image: 'https://source.unsplash.com/300x200/?chemical,fire',
        prices: { USD: 80, GBP: 64, EUR: 72, NGN: 32000 },
        available: true
    },
    {
        id: 6,
        name: 'Fire Grenade Throwable (1 Unit)',
        type: 'Throwable',
        description: 'Easy-throw grenade that bursts on impact to suppress small fires.',
        image: 'https://source.unsplash.com/300x200/?grenade,fire',
        prices: { USD: 25, GBP: 20, EUR: 23, NGN: 10000 },
        available: true
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCurrency = 'USD';

function showTab(tabName) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    if (tabName === 'shop') {
        renderProducts();
        updateCartDisplay();
    } else if (tabName === 'home') {
        renderFeaturedProducts();
    }
}

function renderFeaturedProducts() {
    const featured = products.slice(0, 3);
    const container = document.getElementById('featuredProducts');
    container.innerHTML = featured.map(product => `
        <div class="col-md-4">
            <div class="card product-card ${!product.available ? 'unavailable' : ''}">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description.substring(0, 100)}...</p>
                    <p class="text-danger fw-bold">${getPrice(product)} ${currentCurrency}</p>
                    ${product.available ? `<button class="btn btn-danger" onclick="addToCart(${product.id})">Add to Cart</button>` : '<p class="text-muted">Unavailable</p>'}
                </div>
            </div>
        </div>
    `).join('');
}

function renderProducts(filtered = products) {
    const container = document.getElementById('productGrid');
    container.innerHTML = filtered.map(product => `
        <div class="col-md-4" data-type="${product.type.toLowerCase()}" data-available="${product.available ? 'available' : 'unavailable'}">
            <div class="card product-card ${!product.available ? 'unavailable' : ''}">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="text-danger fw-bold">${getPrice(product)} ${currentCurrency}</p>
                    ${product.available ? `<button id="addToCart" class="btn btn-danger" onclick="addToCart(${product.id})">Add to Cart</button>` : '<p class="text-muted">Unavailable</p>'}
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const typeFilter = document.getElementById('typeFilter').value.toLowerCase();
    const availFilter = document.getElementById('availFilter').value;
    let filtered = products;

    if (typeFilter) {
        filtered = filtered.filter(p => p.type.toLowerCase() === typeFilter);
    }
    if (availFilter) {
        filtered = filtered.filter(p => (p.available ? 'available' : 'unavailable') === availFilter);
    }

    renderProducts(filtered);
}

function getPrice(product) {
    return product.prices[currentCurrency].toFixed(2);
}

function updatePrices() {
    currentCurrency = document.getElementById('currencySelect').value;
    if (document.getElementById('shop').style.display !== 'none') {
        renderProducts();
    }
    if (document.getElementById('home').style.display !== 'none') {
        renderFeaturedProducts();
    }
    updateCartDisplay();
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product.available) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    alert(`${product.name} added to cart!`);
}

function updateCartDisplay() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartItemCount').textContent = count;

    const cartContainer = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (count > 0) {
        summary.style.display = 'block';
        cartContainer.innerHTML = cart.map(item => `
            <li>${item.name} x${item.quantity} - ${getPrice(item)} ${currentCurrency} = ${(getPrice(item) * item.quantity).toFixed(2)} ${currentCurrency}
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">Remove</button>
            </li>
        `).join('');
        const total = cart.reduce((sum, item) => sum + (getPrice(item) * item.quantity), 0);
        cartContainer.innerHTML += `<p><strong>Total: ${total.toFixed(2)} ${currentCurrency}</strong></p>`;
    } else {
        summary.style.display = 'none';
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

async function checkout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    const lineItems = cart.map(item => ({
        price_data: {
            currency: currentCurrency.toLowerCase(),
            product_data: { name: item.name },
            unit_amount: Math.round(getPrice(item) * 100), // Cents
        },
        quantity: item.quantity,
    }));

    try {
        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line_items: lineItems }),
        });
        const { sessionId } = await response.json();
        stripe.redirectToCheckout({ sessionId });
    } catch (error) {
        alert('Checkout failed: ' + error.message);
    }
}

function toggleAdmin() {
    const pass = prompt('Admin Password:');
    if (pass === 'admin') { // Change this password
        document.getElementById('adminPanel').style.display = 'block';
        const adminContainer = document.getElementById('adminPanel');
        adminContainer.innerHTML = '<h3>Toggle Availability:</h3>' + products.map((p, i) => `
            <label><input type="checkbox" ${p.available ? 'checked' : ''} onchange="toggleAvailability(${p.id})"> ${p.name}</label><br>
        `).join('');
    }
}

function toggleAvailability(id) {
    const product = products.find(p => p.id === id);
    product.available = !product.available;
    alert(`${product.name} toggled to ${product.available ? 'Available' : 'Unavailable'}. Refresh shop to see.`);
    // To persist, edit products array and redeploy
}

document.addEventListener('DOMContentLoaded', () => {
    showTab('home');
    updateCartDisplay();
    // Uncomment to show admin: toggleAdmin();
});