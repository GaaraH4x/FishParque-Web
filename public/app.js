// Global state
let currentUser = null;
let cart = [];
let products = {};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('fishParqueUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Load products
    await loadProducts();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('fishParqueCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
});

// Auth Functions
function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('fishParqueUser', JSON.stringify(data.user));
            updateUIForLoggedInUser();
            showMessage('authMessage', data.message, 'success');
            setTimeout(() => showSection('shop'), 1500);
        } else {
            showMessage('authMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('authMessage', 'Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        address: document.getElementById('regAddress').value,
        password: document.getElementById('regPassword').value
    };
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('authMessage', data.message, 'success');
            setTimeout(() => switchAuthTab('login'), 2000);
            document.getElementById('registerForm').reset();
        } else {
            showMessage('authMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('authMessage', 'Registration failed. Please try again.', 'error');
    }
}

function logout() {
    currentUser = null;
    cart = [];
    localStorage.removeItem('fishParqueUser');
    localStorage.removeItem('fishParqueCart');
    updateUIForLoggedOutUser();
    showSection('login');
}

function updateUIForLoggedInUser() {
    document.getElementById('loginLink').style.display = 'none';
    document.getElementById('logoutLink').style.display = 'block';
    document.getElementById('ordersLink').style.display = 'block';
    document.getElementById('cartLink').style.display = 'block';
    document.getElementById('welcomeText').textContent = `Welcome back, ${currentUser.name}!`;
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginLink').style.display = 'block';
    document.getElementById('logoutLink').style.display = 'none';
    document.getElementById('ordersLink').style.display = 'none';
    document.getElementById('cartLink').style.display = 'none';
    document.getElementById('welcomeText').textContent = '';
}

// Products Functions
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
            products = data.products;
            displayProducts();
        }
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    Object.keys(products).forEach(key => {
        const product = products[key];
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p class="product-price">₦${product.price}/${product.unit}</p>
            <p class="product-min">Minimum order: ${product.minQty}${product.unit}</p>
            <div class="quantity-controls">
                <button onclick="changeQuantity('${key}', -1)">-</button>
                <input type="number" id="qty-${key}" value="${product.minQty}" min="${product.minQty}" step="0.1">
                <button onclick="changeQuantity('${key}', 1)">+</button>
            </div>
            <button class="btn-primary" onclick="addToCart('${key}')">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

function changeQuantity(productKey, delta) {
    const input = document.getElementById(`qty-${productKey}`);
    const product = products[productKey];
    let value = parseFloat(input.value) + delta;
    
    if (value < product.minQty) value = product.minQty;
    input.value = value;
}

function addToCart(productKey) {
    const product = products[productKey];
    const quantity = parseFloat(document.getElementById(`qty-${productKey}`).value);
    
    if (quantity < product.minQty) {
        alert(`Minimum order for ${product.name} is ${product.minQty}${product.unit}`);
        return;
    }
    
    const existingItem = cart.find(item => item.id === productKey);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            id: productKey,
            name: product.name,
            price: product.price,
            quantity: quantity,
            subtotal: quantity * product.price
        });
    }
    
    saveCart();
    updateCartUI();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productKey) {
    cart = cart.filter(item => item.id !== productKey);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('fishParqueCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSummary.style.display = 'none';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        total += item.subtotal;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.quantity}kg × ₦${item.price} = ₦${item.subtotal}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString();
    cartSummary.style.display = 'block';
}

// Checkout Functions
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    // Pre-fill user info if logged in
    if (currentUser) {
        document.getElementById('checkoutName').value = currentUser.name;
        document.getElementById('checkoutPhone').value = currentUser.phone;
        document.getElementById('checkoutAddress').value = currentUser.address;
    }
    
    // Display cart items
    let total = 0;
    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        total += item.subtotal;
        checkoutItems.innerHTML += `<p>${item.name}: ${item.quantity}kg × ₦${item.price} = ₦${item.subtotal}</p>`;
    });
    
    checkoutTotal.textContent = total.toLocaleString();
    modal.classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

async function placeOrder(e) {
    e.preventDefault();
    
    const orderData = {
        userEmail: currentUser ? currentUser.email : 'guest@fishparque.com',
        userName: document.getElementById('checkoutName').value,
        userPhone: document.getElementById('checkoutPhone').value,
        userAddress: document.getElementById('checkoutAddress').value,
        cart: cart,
        total: cart.reduce((sum, item) => sum + item.subtotal, 0)
    };
    
    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('checkoutMessage', data.message, 'success');
            cart = [];
            saveCart();
            updateCartUI();
            
            setTimeout(() => {
                closeCheckout();
                if (currentUser) {
                    showSection('orders');
                    loadUserOrders();
                } else {
                    showSection('shop');
                }
            }, 3000);
        } else {
            showMessage('checkoutMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('checkoutMessage', 'Order failed. Please try again.', 'error');
    }
}

// Orders Functions
async function loadUserOrders() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/orders/${currentUser.email}`);
        const data = await response.json();
        
        if (data.success) {
            displayOrders(data.orders);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="empty-cart">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = '';
    orders.reverse().forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <strong>Order #${order.orderNumber}</strong>
                    <p>${new Date(order.date).toLocaleString()}</p>
                </div>
                <span class="order-status ${order.status}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        ${item.name}: ${item.quantity}kg × ₦${item.price} = ₦${item.subtotal}
                    </div>
                `).join('')}
            </div>
            <h3>Total: ₦${order.total.toLocaleString()}</h3>
        `;
        ordersList.appendChild(orderCard);
    });
}

// UI Functions
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (sectionName === 'orders' && currentUser) {
        loadUserOrders();
    }
    
    if (sectionName === 'cart') {
        updateCartUI();
    }
}

function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    }
}