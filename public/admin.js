let adminKey = '';
let allOrders = [];
let allUsers = [];

// Admin Login
async function adminLogin(e) {
    e.preventDefault();
    
    const key = document.getElementById('adminKey').value;
    
    try {
        const response = await fetch('/api/admin/orders', {
            headers: { 'x-admin-key': key }
        });
        
        if (response.status === 403) {
            showMessage('loginMessage', 'Invalid admin key', 'error');
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            adminKey = key;
            localStorage.setItem('adminKey', key);
            document.getElementById('adminLoginSection').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            loadDashboardData();
        } else {
            showMessage('loginMessage', 'Invalid admin key', 'error');
        }
    } catch (error) {
        showMessage('loginMessage', 'Connection error. Please try again.', 'error');
    }
}

// Admin Logout
function adminLogout() {
    adminKey = '';
    localStorage.removeItem('adminKey');
    document.getElementById('adminLoginSection').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
        document.getElementById('adminKey').value = savedKey;
        adminLogin({ preventDefault: () => {} });
    }
});

// Load Dashboard Data
async function loadDashboardData() {
    await Promise.all([
        loadOrders(),
        loadUsers(),
        loadProducts()
    ]);
    updateStatistics();
}

// Load Orders
async function loadOrders() {
    try {
        const response = await fetch('/api/admin/orders', {
            headers: { 'x-admin-key': adminKey }
        });
        
        const data = await response.json();
        
        if (data.success) {
            allOrders = data.orders;
            displayOrders(allOrders);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

// Display Orders
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No orders yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    orders.reverse().forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.orderNumber}</strong></td>
            <td>${new Date(order.date).toLocaleString()}</td>
            <td>${order.customer.name}<br><small>${order.customer.email}</small></td>
            <td>${order.customer.phone}</td>
            <td><strong>₦${order.total.toLocaleString()}</strong></td>
            <td><span class="order-status ${order.status}">${order.status}</span></td>
            <td><button class="order-details-btn" onclick='viewOrderDetails(${JSON.stringify(order)})'>View</button></td>
        `;
        tbody.appendChild(row);
    });
}

// View Order Details
function viewOrderDetails(order) {
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    
    content.innerHTML = `
        <div style="background: #f9f9f9; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
            <h3>Order #${order.orderNumber}</h3>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></p>
        </div>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${order.customer.name}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
        <p><strong>Phone:</strong> ${order.customer.phone}</p>
        <p><strong>Address:</strong> ${order.customer.address}</p>
        
        <h3 style="margin-top: 1.5rem;">Order Items</h3>
        <table style="width: 100%; margin-top: 1rem;">
            <thead>
                <tr style="background: #f0f0f0;">
                    <th style="padding: 0.5rem; text-align: left;">Product</th>
                    <th style="padding: 0.5rem; text-align: right;">Quantity</th>
                    <th style="padding: 0.5rem; text-align: right;">Price</th>
                    <th style="padding: 0.5rem; text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td style="padding: 0.5rem;">${item.name}</td>
                        <td style="padding: 0.5rem; text-align: right;">${item.quantity}kg</td>
                        <td style="padding: 0.5rem; text-align: right;">₦${item.price}</td>
                        <td style="padding: 0.5rem; text-align: right;">₦${item.subtotal.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr style="background: #f0f0f0; font-weight: bold;">
                    <td colspan="3" style="padding: 0.5rem; text-align: right;">TOTAL:</td>
                    <td style="padding: 0.5rem; text-align: right;">₦${order.total.toLocaleString()}</td>
                </tr>
            </tfoot>
        </table>
    `;
    
    modal.classList.add('active');
}

function closeOrderDetails() {
    document.getElementById('orderDetailsModal').classList.remove('active');
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'x-admin-key': adminKey }
        });
        
        const data = await response.json();
        
        if (data.success) {
            allUsers = data.users;
            displayUsers(allUsers);
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// Display Users
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Load Products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

// Display Products
function displayProducts(products) {
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    Object.keys(products).forEach(key => {
        const product = products[key];
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.marginBottom = '1rem';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Price:</strong> ₦${product.price}/${product.unit}</p>
            <p><strong>Minimum Order:</strong> ${product.minQty}${product.unit}</p>
        `;
        container.appendChild(card);
    });
}

// Update Statistics
function updateStatistics() {
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const totalUsers = allUsers.length;
    const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('pendingOrders').textContent = pendingOrders;
}

// Tab Switching
function showAdminTab(tabName) {
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = document.querySelectorAll('.admin-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Filter Orders
function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    
    const filtered = allOrders.filter(order => {
        return order.orderNumber.toLowerCase().includes(searchTerm) ||
               order.customer.name.toLowerCase().includes(searchTerm) ||
               order.customer.email.toLowerCase().includes(searchTerm) ||
               order.customer.phone.includes(searchTerm);
    });
    
    displayOrders(filtered);
}

// Filter Users
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    
    const filtered = allUsers.filter(user => {
        return user.name.toLowerCase().includes(searchTerm) ||
               user.email.toLowerCase().includes(searchTerm);
    });
    
    displayUsers(filtered);
}

// Export Orders to CSV
function exportOrders() {
    if (allOrders.length === 0) {
        alert('No orders to export');
        return;
    }
    
    let csv = 'Order Number,Date,Customer Name,Email,Phone,Address,Items,Total,Status\n';
    
    allOrders.forEach(order => {
        const items = order.items.map(item => `${item.name} (${item.quantity}kg)`).join('; ');
        csv += `"${order.orderNumber}","${order.date}","${order.customer.name}","${order.customer.email}","${order.customer.phone}","${order.customer.address}","${items}","${order.total}","${order.status}"\n`;
    });
    
    downloadCSV(csv, 'fish-parque-orders.csv');
}

// Export Users to CSV
function exportUsers() {
    if (allUsers.length === 0) {
        alert('No users to export');
        return;
    }
    
    let csv = 'Name,Email,Phone,Address,Registered Date\n';
    
    allUsers.forEach(user => {
        csv += `"${user.name}","${user.email}","${user.phone}","${user.address}","${user.createdAt}"\n`;
    });
    
    downloadCSV(csv, 'fish-parque-users.csv');
}

// Download CSV Helper
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Show Message
function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 3000);
    }
}