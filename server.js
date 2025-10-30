const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Product catalog with prices
const products = {
    'fish_feed': { name: 'Fish Feed', minQty: 10, price: 500, unit: 'kg' },
    'catfish': { name: 'Catfish', minQty: 1, price: 1500, unit: 'kg' },
    'materials': { name: 'Materials', minQty: 50, price: 300, unit: 'kg' }
};

// Helper function to hash passwords
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper function to generate tokens
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Helper function to read JSON file
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return filename === 'users.json' ? {} : [];
    }
}

// Helper function to write JSON file
async function writeJSON(filename, data) {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        const users = await readJSON('users.json');

        if (users[email]) {
            return res.json({ success: false, message: 'Email already registered' });
        }

        users[email] = {
            name,
            email,
            password: hashPassword(password),
            phone,
            address,
            createdAt: new Date().toISOString()
        };

        await writeJSON('users.json', users);

        res.json({ success: true, message: 'Registration successful! Please login.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.json({ success: false, message: 'Registration failed. Please try again.' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const users = await readJSON('users.json');
        const user = users[email];

        if (!user || user.password !== hashPassword(password)) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken();
        
        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: 'Login failed. Please try again.' });
    }
});

// Get Products
app.get('/api/products', (req, res) => {
    res.json({ success: true, products });
});

// Place Order (Cart Checkout)
app.post('/api/order', async (req, res) => {
    try {
        const { userEmail, userName, userPhone, userAddress, cart, total } = req.body;

        if (!userEmail || !cart || cart.length === 0) {
            return res.json({ success: false, message: 'Invalid order data' });
        }

        // Generate order
        const orderNumber = 'FP' + Date.now() + Math.floor(Math.random() * 1000);
        const orderDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const order = {
            orderNumber,
            date: orderDate,
            customer: { name: userName, email: userEmail, phone: userPhone, address: userAddress },
            items: cart,
            total,
            status: 'pending'
        };

        // Save to orders file
        const orders = await readJSON('orders.json');
        orders.push(order);
        await writeJSON('orders.json', orders);

        // Also save to text file for backup
        const orderText = `Order #${orderNumber} | Date: ${orderDate} | Name: ${userName} | Phone: ${userPhone} | Email: ${userEmail} | Address: ${userAddress} | Total: ₦${total} | Items: ${cart.map(item => `${item.name} (${item.quantity}kg)`).join(', ')}\n`;
        await fs.appendFile('orders.txt', orderText);

        console.log(`✅ Order ${orderNumber} saved`);

        // Send email notification via Formspree
        if (process.env.FORMSPREE_ENDPOINT) {
            try {
                const itemsList = cart.map(item => 
                    `${item.name}: ${item.quantity}kg @ ₦${item.price}/kg = ₦${item.subtotal}`
                ).join('\n');

                await fetch(process.env.FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: `🐟 New Fish Parque Order - ${orderNumber}`,
                        message: `
Order Number: ${orderNumber}
Date: ${orderDate}

CUSTOMER INFORMATION:
Name: ${userName}
Email: ${userEmail}
Phone: ${userPhone}
Address: ${userAddress}

ORDER DETAILS:
${itemsList}

TOTAL: ₦${total}

✅ Order saved to database.
                        `
                    })
                });
                console.log(`✅ Email sent for order ${orderNumber}`);
            } catch (error) {
                console.error('Email error:', error.message);
            }
        }

        res.json({
            success: true,
            message: `Thank you! Your order #${orderNumber} has been placed successfully. Total: ₦${total}`,
            orderNumber
        });

    } catch (error) {
        console.error('Order error:', error);
        res.json({ success: false, message: 'Order failed. Please try again.' });
    }
});

// Get User Orders
app.get('/api/orders/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await readJSON('orders.json');
        const userOrders = orders.filter(order => order.customer.email === email);
        
        res.json({ success: true, orders: userOrders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.json({ success: false, orders: [] });
    }
});

// Admin: Get All Orders
app.get('/api/admin/orders', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        
        if (adminKey !== process.env.ADMIN_KEY) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const orders = await readJSON('orders.json');
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Admin orders error:', error);
        res.json({ success: false, orders: [] });
    }
});

// Admin: Get All Users
app.get('/api/admin/users', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        
        if (adminKey !== process.env.ADMIN_KEY) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const usersData = await readJSON('users.json');
        const users = Object.values(usersData).map(user => ({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt
        }));
        
        res.json({ success: true, users });
    } catch (error) {
        console.error('Admin users error:', error);
        res.json({ success: false, users: [] });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Fish Parque API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🐟 Fish Parque Enhanced Server running on port ${PORT}`);
});