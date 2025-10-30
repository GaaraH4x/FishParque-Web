# 🎛️ Fish Parque - Admin Dashboard Guide

## ✨ What You Get

Your Admin Dashboard includes:
- ✅ **Real-time statistics** - Total orders, revenue, users, pending orders
- ✅ **Orders management** - View all orders with search & filter
- ✅ **User management** - See all registered customers
- ✅ **Product catalog** - View all products and prices
- ✅ **Export to CSV** - Download orders and users data
- ✅ **Order details** - View full order information
- ✅ **Secure access** - Password protected

---

## 📁 Files to Add

Add these 2 new files to your `public` folder:

1. **public/admin.html** - Admin dashboard page
2. **public/admin.js** - Admin dashboard JavaScript

Your structure should be:
```
fish-parque/
├── server.js          (Updated with admin endpoints)
├── package.json
└── public/
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── admin.html     ← NEW
    └── admin.js       ← NEW
```

---

## 🔐 Setup Admin Access

### Step 1: Set Admin Password

1. Go to **Render Dashboard**
2. Click your **fish-parque** service
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `ADMIN_KEY`
   - **Value**: `YourSecurePassword123` (choose a strong password!)
6. Click **"Save Changes"**
7. Render will automatically redeploy

### Step 2: Access Admin Dashboard

1. Go to: `https://your-site.onrender.com/admin.html`
2. Enter your admin key (the password you set)
3. Click **Login**

---

## 📊 Dashboard Features

### 1. Statistics Dashboard
View at a glance:
- **Total Orders** - All orders placed
- **Total Revenue** - Sum of all order values in ₦
- **Registered Users** - Number of customer accounts
- **Pending Orders** - Orders awaiting fulfillment

### 2. Orders Tab
- **View all orders** in a table
- **Search orders** by order number, customer name, email, or phone
- **View order details** - Click "View" to see full order information
- **Export to CSV** - Download all orders as spreadsheet

Order details include:
- Order number & date
- Customer information (name, email, phone, address)
- All items ordered with quantities and prices
- Order total
- Order status

### 3. Users Tab
- **View all registered users**
- **Search users** by name or email
- **Export to CSV** - Download user list
- See registration dates

### 4. Products Tab
- View all products in catalog
- See prices and minimum quantities
- Quick reference for customer inquiries

---

## 💡 How to Use

### Checking New Orders:

**Option 1: Email Notifications**
- You receive email for every order (via Formspree)

**Option 2: Admin Dashboard**
1. Visit: `your-site.onrender.com/admin.html`
2. Login with admin key
3. Orders tab shows all orders

**Option 3: Render Shell**
```bash
cat orders.json    # All orders in JSON format
cat orders.txt     # Simple text format
```

### Searching Orders:
1. Go to Orders tab
2. Type in search box:
   - Order number (e.g., "FP123456")
   - Customer name
   - Email address
   - Phone number
3. Table filters automatically

### Exporting Data:
1. Click **"Export Orders to CSV"** or **"Export Users to CSV"**
2. File downloads automatically
3. Open in Excel, Google Sheets, etc.

### Viewing Order Details:
1. Find the order in Orders tab
2. Click **"View"** button
3. Modal opens with:
   - Full customer info
   - All order items
   - Total amount
   - Order status

---

## 🔒 Security

- ✅ **Password protected** - Only you can access with admin key
- ✅ **Secure headers** - Admin key sent securely
- ✅ **No public access** - Dashboard requires authentication
- ✅ **Saved locally** - Admin key saved in browser for convenience

**Important:** 
- Keep your admin key secure
- Don't share the admin URL publicly
- Change admin key if compromised (in Render Environment Variables)

---

## 📥 CSV Export Format

### Orders CSV includes:
- Order Number
- Date & Time
- Customer Name
- Email
- Phone
- Address
- Items (all products in order)
- Total Amount
- Order Status

### Users CSV includes:
- Name
- Email
- Phone
- Address
- Registration Date

---

## 🎯 Quick Access

**Customer Site:**
`https://your-site.onrender.com`

**Admin Dashboard:**
`https://your-site.onrender.com/admin.html`

---

## 🆘 Troubleshooting

### Can't login to admin dashboard:
- Check that `ADMIN_KEY` is set in Render Environment Variables
- Make sure you're using the exact password you set
- Try clearing browser cache and reload

### No orders showing:
- Verify orders exist (check email or orders.txt)
- Check browser console for errors (F12)
- Verify admin key is correct

### Export not working:
- Ensure browser allows downloads
- Check that orders/users exist
- Try different browser

---

## 📱 Mobile Responsive

The admin dashboard works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

You can manage orders from anywhere!

---

## 🎉 Summary

With the admin dashboard, you can now:

1. ✅ **View all orders** without checking email
2. ✅ **Search and filter** orders easily
3. ✅ **See customer information** clearly
4. ✅ **Track revenue** in real-time
5. ✅ **Export data** for accounting/records
6. ✅ **Manage from anywhere** (mobile-friendly)

No more checking emails or Render shell - everything is in one beautiful dashboard! 🚀