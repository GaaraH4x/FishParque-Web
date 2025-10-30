# FishParque-Web
# 🐟 Fish Parque Enhanced - Deployment Guide

## 📁 New File Structure

```
fish-parque/
├── server.js          (Enhanced backend)
├── package.json       (Updated dependencies)
└── public/
    ├── index.html     (New UI with login/cart)
    ├── styles.css     (Enhanced styles)
    └── app.js         (Frontend JavaScript)
```

## 🚀 Deployment Steps

### Step 1: Update Your Repository

1. **Replace server.js** with the enhanced version
2. **Replace package.json** with the new version
3. **In the `public` folder:**
   - Replace `index.html` with the enhanced version
   - Replace `styles.css` with the enhanced version
   - Rename `script.js` to `app.js` and replace with enhanced version

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Enhanced Fish Parque with accounts and cart"
git push origin main
```

### Step 3: Render Will Auto-Deploy

Render will automatically:
- Detect changes
- Install dependencies
- Deploy the enhanced version

### Step 4: Add Admin Key (Optional)

To access the admin panel:
1. Go to Render → Environment
2. Add: `ADMIN_KEY` = (create a secure password)
3. Save and redeploy

## ✨ New Features

### For Customers:
- ✅ **User Registration** - Create account for faster checkout
- ✅ **Login System** - Secure authentication
- ✅ **Shopping Cart** - Add multiple items before checkout
- ✅ **Guest Checkout** - Order without account
- ✅ **Order History** - View all past orders
- ✅ **Profile Info** - Auto-fill delivery details

### For You (Admin):
- ✅ **All orders saved** to `orders.json` (structured data)
- ✅ **Backup to orders.txt** (text format)
- ✅ **User database** in `users.json`
- ✅ **Email notifications** via Formspree (already configured)

## 💳 Product Pricing

Current products:
- **Fish Feed**: ₦500/kg (Min: 10kg)
- **Catfish**: ₦1,500/kg (Min: 1kg)
- **Materials**: ₦300/kg (Min: 50kg)

To change prices, edit the `products` object in `server.js`.

## 🔐 Security Features

- Passwords are hashed (SHA-256)
- No plain text password storage
- Session tokens for logged-in users
- Admin panel protected by API key

## 📊 Viewing Orders

### Method 1: Check Email
You'll receive email for every order via Formspree

### Method 2: Render Shell
```bash
cat orders.json    # Structured data
cat orders.txt     # Simple text format
```

### Method 3: Download Files
1. Render Dashboard → Shell
2. `cat orders.json` → Copy content
3. Save to your computer

## 🛠️ Customization Options

### Change Product Prices
Edit `server.js`, line 19-23:
```javascript
const products = {
    'fish_feed': { name: 'Fish Feed', minQty: 10, price: 500, unit: 'kg' },
    'catfish': { name: 'Catfish', minQty: 1, price: 1500, unit: 'kg' },
    'materials': { name: 'Materials', minQty: 50, price: 300, unit: 'kg' }
};
```

### Add New Products
Add to the `products` object:
```javascript
'new_product': { name: 'Product Name', minQty: 5, price: 800, unit: 'kg' }
```

### Change Colors
Edit `styles.css`, change these values:
- Primary color: `#667eea`
- Secondary color: `#764ba2`

## 📱 Mobile Responsive

The enhanced design is fully responsive and works on:
- ✅ Desktop
- ✅ Tablets
- ✅ Mobile phones

## 🎉 What's Better Than Before

| Feature | Old Version | New Version |
|---------|-------------|-------------|
| Ordering | Fill form each time | Cart system |
| User Info | Type every time | Saved in profile |
| Multiple Items | One order per form | Add many to cart |
| Order Tracking | No tracking | View order history |
| Price Display | None | Clear pricing |
| Account | No accounts | Full registration |
| Mobile | Basic | Fully optimized |

## 🆘 Troubleshooting

### Orders not saving
- Check Render logs for errors
- Verify `orders.json` and `users.json` are writable

### Email not working
- Check `FORMSPREE_ENDPOINT` is set correctly
- Verify Formspree is active

### Login issues
- Clear browser localStorage
- Check `users.json` exists

## 📞 Support

Your enhanced Fish Parque system is ready to handle:
- Multiple customers simultaneously
- User accounts with secure passwords
- Shopping cart functionality
- Complete order tracking
- Email notifications

Enjoy your upgraded system! 🚀🐟
