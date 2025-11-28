# Traditions - Quick Start Guide

## 🎯 Get Started in 3 Steps

### 1. Access Your Vendor Account
Open `vendor-manager.html` and sign in:
```
Email: GM11788@GMAIL.COM
Password: VendorTest@2025!
```

### 2. Upload Your First Product
**Single Upload Method:**
- Fill in: Product Name, Category, Unit, Price
- Add photo (optional)
- Click "Deploy Product"
- ✅ Done! Product is live in marketplace

**Bulk Upload Method:**
- Click "Bulk Upload" tab
- Paste your menu:
  ```
  ---C's--- @$300
  32x BBR
  OR: 11 Blue Ice packs @250
  ```
- Click "Deploy All"
- ✅ All products live

### 3. Browse Marketplace
Open `traditions-bulk.html` to see your products live!

---

## 📋 Role Reference Table

```
YOUR ACCOUNT (GM11788@GMAIL.COM):
├─ Role: VENDOR_PREMIUM
├─ Can Upload: ✅ YES (Unlimited)
├─ Can Buy: ✅ YES
├─ Can Manage: ❌ NO
└─ Features: Single + Bulk Upload, Inventory, Sales Reports

OTHER VENDOR ROLES:
├─ VENDOR_STANDARD: ✅ Upload (single only) + Browse
├─ VENDOR_TRIAL: ✅ Upload (max 5 products) + Browse
└─ Features vary by tier

BUYER ROLES:
├─ BUYER_COMMERCIAL: ✅ Full purchasing, Offers, Wholesale
├─ BUYER_RETAIL: ✅ Standard purchases
└─ BUYER_TRIAL: ✅ Browse only

ADMIN ROLES:
├─ VENDOR_MANAGER: ✅ Approve listings, View sales
└─ PLATFORM_ADMIN: ✅ Full system access
```

---

## 🧪 Test Other Accounts

### All Test Emails:
```
VENDORS (Can Upload):
- cultivator@traditions.local (Password: Cultivator@2025!)
- processor@traditions.local (Password: Processor@2025!)
- transporter@traditions.local (Password: Transporter@2025!)
- laboratory@traditions.local (Password: Laboratory@2025!)
- trial.vendor@traditions.local (Password: TrialVendor@2025!)

BUYERS (Can Buy):
- distributor@traditions.local (Password: Distributor@2025!)
- retailer@traditions.local (Password: Retailer@2025!)
- trial.buyer@traditions.local (Password: TrialBuyer@2025!)

ADMINS (Can Manage):
- admin@traditions.local (Password: AdminPlatform@2025!)
- manager@traditions.local (Password: VendorMgr@2025!)
```

---

## 🎨 UI Guide

### Vendor Manager (vendor-manager.html)
**Light Blue Sections = Vendor Features**
```
┌─────────────────────────────────────┐
│  VENDOR MANAGER                     │ ← Renamed from "Admin"
├─────────────────────────────────────┤
│ [Single Upload] [Bulk Upload] ...   │ ← Tabs
├─────────────────────────────────────┤
│ 🔵 ┌─────────────────────────────┐  │ ← Light Blue
│    │ Single Product Upload       │  │    (Vendor Feature)
│    │ • Product Name *            │  │
│    │ • Category *                │  │
│    │ • Unit                      │  │
│    │ • Price * | $ 0.00          │  │
│    │ • Photo (optional)          │  │
│    │ [Deploy Product]            │  │
│    └─────────────────────────────┘  │
│                                      │
│ 🔵 ┌─────────────────────────────┐  │ ← Light Blue
│    │ Bulk Upload                 │  │    (Vendor Feature)
│    │ (Paste Menu)                │  │
│    │ [Deploy All] [Clear]        │  │
│    └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Marketplace (traditions-bulk.html)
```
┌─────────────────────────────────────┐
│  TRADITIONS LIVE MARKET             │
├─────────────────────────────────────┤
│ [Search] [Filter] [Sort]            │
├─────────────────────────────────────┤
│ Product Card 1                      │ ← From your vendor
│ ├─ Name: Premium OG Kush           │
│ ├─ Vendor: GM11788@GMAIL.COM       │ ← Your info
│ ├─ Price: $300/lb                  │
│ └─ [View Details] [Add to Cart]    │
│                                      │
│ Product Card 2                      │
│ ... (More products)                 │
└─────────────────────────────────────┘
```

---

## 📊 Permission Matrix Quick View

```
                 | UPLOAD | BULK | EDIT | BUY | MANAGE | VIEW
─────────────────┼────────┼──────┼──────┼─────┼────────┼─────
VENDOR_PREMIUM   |   ✅   |  ✅  |  ✅  | ✅  |   ❌   |  ✅
VENDOR_STANDARD  |   ✅   |  ❌  |  ✅  | ✅  |   ❌   |  ✅
VENDOR_TRIAL     |  ✅*   |  ❌  |  ❌  | ✅  |   ❌   |  ✅
BUYER_COMM       |   ❌   |  ❌  |  ❌  | ✅  |   ❌   |  ✅
BUYER_RETAIL     |   ❌   |  ❌  |  ❌  | ✅  |   ❌   |  ✅
BUYER_TRIAL      |   ❌   |  ❌  |  ❌  | ❌  |   ❌   |  ✅
VEN_MANAGER      |   ❌   |  ❌  |  ❌  | ❌  |   ✅   |  ✅
PLATFORM_ADMIN   |   ✅   |  ✅  |  ✅  | ✅  |   ✅   |  ✅

✅ = Can do | ❌ = Cannot | ✅* = Limited (max 5)
```

---

## 🚀 Common Tasks

### Upload a Single Product
1. Go to `vendor-manager.html`
2. Sign in (GM11788@GMAIL.COM / VendorTest@2025!)
3. Enter product details
4. Click "Deploy Product"
5. Check marketplace after 1 minute

### Upload Bulk Products
1. Go to `vendor-manager.html` → "Bulk Upload" tab
2. Paste menu text
3. Review preview
4. Click "Deploy All"

### View Your Products
1. Go to `vendor-manager.html` → "Inventory" tab
2. See all your products with sales data

### Test Different Roles
1. Use different test account emails
2. Each role has different upload/buy permissions
3. Upload sections only appear for vendors
4. Buy buttons only appear for buyers

### Check Marketplace
1. Open `traditions-bulk.html`
2. Search for your products
3. View vendor information
4. See all uploaded products

---

## 📝 File Structure

```
traditions-live/
├── public/
│   └── license-lookup.html
├── vendor-manager.html ← NEW (Replaces admin.html)
├── traditions-bulk.html ← Marketplace
├── js/
│   ├── permissions.js ← NEW
│   ├── test-users.js ← NEW
│   ├── auth-helper.js ← NEW
│   ├── firebase-init.js
│   └── ...
├── ROLES_AND_PERMISSIONS.md ← NEW
├── PERMISSIONS_IMPLEMENTATION_GUIDE.md ← NEW
└── PERMISSIONS_SUMMARY.md ← NEW
```

---

## 🔧 Troubleshooting

### Can't Upload Products
✓ Check you're logged in as vendor (not buyer)
✓ Use vendor email: GM11788@GMAIL.COM
✓ Role should be "vendor_premium"
✓ Check browser console for errors

### Products Not Showing in Marketplace
✓ Wait 1-2 minutes for sync
✓ Refresh marketplace page (F5)
✓ Check Firestore has products
✓ Verify vendor ID matches

### Login Failed
✓ Check email spelling (case-insensitive)
✓ Verify password exactly: VendorTest@2025!
✓ Clear browser cache
✓ Check Firebase is initialized

### Light Blue Sections Not Showing
✓ Verify you're signed in as vendor
✓ Check vendor-manager.html file exists
✓ Refresh page
✓ Check browser console for errors

---

## 💡 Quick Tips

**For Maximum Bulk Upload Speed:**
- Use clear menu format
- Include prices (@$price)
- Group by section (---C's---)
- Grok AI handles typos well

**For Product Visibility:**
- Use clear product names
- Set competitive prices
- Include photos when possible
- Check marketplace after 1 min

**For Testing:**
- Try all test accounts
- Compare upload sections per role
- Test bulk with different menu formats
- Monitor what appears in marketplace

---

## 📞 Support

**For Role Questions:**
→ See `ROLES_AND_PERMISSIONS.md`

**For Implementation:**
→ See `PERMISSIONS_IMPLEMENTATION_GUIDE.md`

**For Test Accounts:**
→ See `js/test-users.js`

**For Permission Logic:**
→ See `js/permissions.js`

**For Firebase Integration:**
→ See `js/auth-helper.js`

---

## ✨ Features at a Glance

✅ **9 Different Roles** - Complete permission system
✅ **11 Test Accounts** - All license types covered
✅ **Light Blue UI** - Easy vendor feature identification
✅ **AI Bulk Upload** - Grok-powered menu parsing
✅ **Firestore Integration** - Cloud-based user profiles
✅ **Vendor Tracking** - Products linked to vendors
✅ **Permission Matrix** - Fine-grained access control
✅ **Auto-Initialization** - Test users auto-created
✅ **Production Ready** - Full documentation included

---

**Start Now:** Sign in to `vendor-manager.html` with GM11788@GMAIL.COM!
