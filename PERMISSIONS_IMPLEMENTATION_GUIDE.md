# Vendor Permissions & Authorization System - Setup & Implementation Guide

## Quick Start

### Files Created/Modified

| File | Purpose | Status |
|------|---------|--------|
| `js/permissions.js` | Core permission definitions and utilities | ✅ Created |
| `js/test-users.js` | Test user accounts for all license types | ✅ Created |
| `js/auth-helper.js` | Firebase integration for auth and permissions | ✅ Created |
| `vendor-manager.html` | Vendor upload interface (replaced admin.html) | ✅ Created |
| `ROLES_AND_PERMISSIONS.md` | User guide and reference | ✅ Created |

---

## System Architecture

### Permission Levels (Hierarchy)

```
┌─────────────────────────────────────┐
│      PLATFORM_ADMIN                  │  ← Full system access
│  (System owner/developer)             │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      VENDOR_MANAGER                  │  ← Manage vendors & approvals
│  (Admin for vendors)                 │
└─────────────────────────────────────┘
           ↓
┌──────────────────────┬──────────────────────┐
│   VENDORS (SELLERS)   │   BUYERS (PURCHASERS) │  ← Commercial actors
│                       │                       │
│ • VENDOR_PREMIUM      │ • BUYER_COMMERCIAL   │
│ • VENDOR_STANDARD     │ • BUYER_RETAIL       │
│ • VENDOR_TRIAL        │ • BUYER_TRIAL        │
└──────────────────────┴──────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      MARKETPLACE_VIEWER               │  ← View-only public access
│  (Anonymous or read-only)            │
└─────────────────────────────────────┘
```

### Role-to-License Mapping

```
LICENSE TYPE         │ DEFAULT ROLE         │ CAN UPLOAD │ CAN BUY
─────────────────────┼──────────────────────┼────────────┼─────────
Cultivator           │ vendor_premium       │ YES        │ YES
Processor            │ vendor_premium       │ YES        │ YES
Distributor          │ buyer_commercial     │ NO         │ YES
Retailer             │ buyer_retail         │ NO         │ YES
Transporter          │ vendor_standard      │ YES        │ YES
Laboratory           │ vendor_standard      │ YES        │ YES
Testing              │ buyer_trial          │ NO         │ NO
(Trial/Test)         │ vendor_trial/buyer_trial │ LTD   │ YES/NO
```

---

## Implementation Guide

### Step 1: Import Permission Modules

In your HTML files that need permission checks:

```javascript
// Permissions utilities
import { hasPermission, getPermissionsForRole } from './js/permissions.js';

// Test user data
import { TEST_USERS } from './js/test-users.js';

// Firebase + Firestore auth helper
import { 
    initializeUserProfile, 
    getUserProfile, 
    canAccessVendorManager 
} from './js/auth-helper.js';
```

### Step 2: Initialize User Profile on Login

```javascript
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db, auth } from './firebase-init.js';
import { initializeUserProfile } from './auth-helper.js';

// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Initialize or retrieve user profile from Firestore
        const userProfile = await initializeUserProfile(user, db);
        console.log('User role:', userProfile.role);
        console.log('User permissions:', userProfile.permissions);
        
        // Show/hide UI elements based on permissions
        setupUIBasedOnPermissions(userProfile);
    }
});
```

### Step 3: Check Permissions Before Actions

```javascript
// Example: Check if user can upload products
const uploadBtn = document.getElementById('uploadBtn');
uploadBtn.addEventListener('click', async () => {
    const userProfile = await getUserProfile(currentUser.uid, db);
    
    if (userHasPermission(userProfile, 'UPLOAD_PRODUCTS')) {
        // Allow upload
        startUploadProcess();
    } else {
        alert('You do not have permission to upload products.');
        console.log('Required role: vendor_premium or higher');
    }
});
```

### Step 4: Style Elements Based on Permissions

```javascript
import { toggleElementByPermission, styleElementByPermission } from './auth-helper.js';

// Hide/show UI elements
toggleElementByPermission(userProfile, 'vendorPanel', 'UPLOAD_PRODUCTS');

// Apply permission-based styling (light blue for vendors)
styleElementByPermission(userProfile, 'uploadSection', 'UPLOAD_PRODUCTS');
```

---

## Firestore Schema Setup

### Users Collection
Store user profiles with roles and permissions:

```javascript
// Collection: users
// Document ID: {firebaseUserId}

{
    uid: "user123",
    email: "vendor@example.com",
    displayName: "John's Cannabis Co",
    licenseNumber: "CVAN-001",
    licenseType: "Cultivator",
    role: "vendor_premium",
    permissions: ["UPLOAD_PRODUCTS", "UPLOAD_BULK_PRODUCTS", ...],
    canUpload: true,
    canBuy: true,
    canManageVendors: false,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    isTestUser: false,
    needsApproval: false
}
```

### Products Collection (Vendor-Specific)
Store products with vendor information:

```javascript
// Collection: inventory
// Document ID: {productId}

{
    productName: "Premium OG Kush Flower",
    category: "Flower",
    unit: "lb",
    price: 300,
    stock: 50,
    imageUrl: "...",
    vendorId: "vendor_uid_123",  // ← Link to vendor
    vendorEmail: "GM11788@GMAIL.COM",
    vendorName: "Test Vendor - GM11788",
    createdAt: Timestamp,
    updatedAt: Timestamp
}
```

### Firestore Security Rules

```javascript
// rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId || 
                      isAdmin(request.auth.uid);
    }

    // Products - vendors can read all, write their own
    match /inventory/{productId} {
      allow read: if userHasPermission(request.auth.uid, 'VIEW_MARKETPLACE');
      allow create: if userHasPermission(request.auth.uid, 'UPLOAD_PRODUCTS');
      allow update, delete: if productBelongsToUser(productId, request.auth.uid) ||
                               isAdmin(request.auth.uid);
    }

    // Helper functions
    function userDoc(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data;
    }

    function userHasPermission(uid, permission) {
      return permission in userDoc(uid).permissions;
    }

    function productBelongsToUser(productId, uid) {
      return get(/databases/$(database)/documents/inventory/$(productId)).data.vendorId == uid;
    }

    function isAdmin(uid) {
      return userDoc(uid).role in ['platform_admin', 'vendor_manager'];
    }
  }
}
```

---

## Testing the System

### Test Scenario 1: Vendor Upload Flow
1. Open `vendor-manager.html`
2. Sign in with: `GM11788@GMAIL.COM` / `VendorTest@2025!`
3. You should see:
   - ✅ Light blue highlighted upload sections
   - ✅ Single product upload form
   - ✅ Bulk upload section
   - ✅ Inventory dashboard
4. Upload a product and verify in marketplace

### Test Scenario 2: Buyer Browsing
1. Sign in to `traditions-bulk.html` with: `distributor@traditions.local` / `Distributor@2025!`
2. You should see:
   - ✅ Full marketplace
   - ✅ Search functionality
   - ✅ Product details
   - ✅ Purchase/offer buttons
3. Try to upload a product → ❌ Should be disabled

### Test Scenario 3: Trial Buyer (View Only)
1. Sign in with: `trial.buyer@traditions.local` / `TrialBuyer@2025!`
2. You should see:
   - ✅ Marketplace products
   - ✅ Search
   - ✅ Product details
   - ❌ Purchase buttons disabled

### Test Scenario 4: Vendor Manager (Approval)
1. Sign in with: `manager@traditions.local` / `VendorMgr@2025!`
2. You should see:
   - ✅ Vendor management dashboard
   - ✅ Listing approval tools
   - ✅ Sales analytics
   - ❌ Upload tools disabled

---

## Integration Checklist

- [ ] Copy `js/permissions.js` to your project
- [ ] Copy `js/test-users.js` to your project
- [ ] Copy `js/auth-helper.js` to your project
- [ ] Replace `admin.html` with `vendor-manager.html`
- [ ] Update `license-lookup.html` to import permissions
- [ ] Update `traditions-bulk.html` marketplace with permission checks
- [ ] Set up Firestore users collection
- [ ] Implement Firestore security rules
- [ ] Test with all user types
- [ ] Connect payment processing (future)
- [ ] Add email notifications (future)
- [ ] Set up analytics (future)

---

## GM11788@GMAIL.COM Setup

Your vendor account is pre-configured as:

**Email**: GM11788@GMAIL.COM  
**Password**: VendorTest@2025!  
**Role**: vendor_premium  
**License**: CVAN-001 (Cultivator)  

**Permissions**:
- ✅ UPLOAD_PRODUCTS
- ✅ UPLOAD_BULK_PRODUCTS
- ✅ EDIT_PRODUCTS
- ✅ DELETE_PRODUCTS
- ✅ VIEW_UPLOAD_DASHBOARD
- ✅ VIEW_MARKETPLACE
- ✅ MANAGE_INVENTORY
- ✅ VIEW_SALES_REPORTS

### What You Can Do:
1. **Single Product Upload**
   - Add product name, category, unit, price
   - Upload photo (optional)
   - Deploy to marketplace

2. **Bulk Upload**
   - Paste menu text
   - AI parses items automatically
   - Deploy multiple products at once

3. **Inventory Management**
   - View all your products
   - Track stock
   - See sales metrics

4. **Browse Marketplace**
   - Find other vendors
   - Make your own purchases
   - View pricing and availability

---

## Permission Constants Reference

### Roles (in `permissions.js`)
```javascript
ROLES = {
    PLATFORM_ADMIN: 'platform_admin',
    VENDOR_MANAGER: 'vendor_manager',
    VENDOR_PREMIUM: 'vendor_premium',
    VENDOR_STANDARD: 'vendor_standard',
    VENDOR_TRIAL: 'vendor_trial',
    BUYER_COMMERCIAL: 'buyer_commercial',
    BUYER_RETAIL: 'buyer_retail',
    BUYER_TRIAL: 'buyer_trial',
    MARKETPLACE_VIEWER: 'marketplace_viewer'
}
```

### Permissions (in `permissions.js`)
```javascript
PERMISSIONS = {
    UPLOAD_PRODUCTS: 'upload_products',
    UPLOAD_BULK_PRODUCTS: 'upload_bulk_products',
    EDIT_PRODUCTS: 'edit_products',
    DELETE_PRODUCTS: 'delete_products',
    VIEW_UPLOAD_DASHBOARD: 'view_upload_dashboard',
    VIEW_MARKETPLACE: 'view_marketplace',
    SEARCH_PRODUCTS: 'search_products',
    VIEW_PRODUCT_DETAILS: 'view_product_details',
    CREATE_OFFERS: 'create_offers',
    MAKE_PURCHASES: 'make_purchases',
    VIEW_CART: 'view_cart',
    MANAGE_INVENTORY: 'manage_inventory',
    VIEW_INVENTORY: 'view_inventory',
    VIEW_SALES_REPORTS: 'view_sales_reports',
    VIEW_PURCHASE_HISTORY: 'view_purchase_history',
    VIEW_ANALYTICS: 'view_analytics',
    MANAGE_VENDORS: 'manage_vendors',
    APPROVE_LISTINGS: 'approve_listings',
    VIEW_ALL_SALES: 'view_all_sales',
    MANAGE_PLATFORM: 'manage_platform',
    VIEW_ACCOUNT: 'view_account',
    EDIT_ACCOUNT: 'edit_account',
    VIEW_LICENSE_INFO: 'view_license_info'
}
```

---

## Key Functions

### Checking Permissions
```javascript
// Single permission check
hasPermission(role, 'UPLOAD_PRODUCTS')

// Multiple permissions (any)
hasAnyPermission(role, ['UPLOAD_PRODUCTS', 'UPLOAD_BULK_PRODUCTS'])

// Multiple permissions (all)
hasAllPermissions(role, ['UPLOAD_PRODUCTS', 'EDIT_PRODUCTS'])

// Get all permissions for role
getPermissionsForRole('vendor_premium')

// Get role for license type
getDefaultRoleForLicense('Cultivator')
```

### UI Management
```javascript
// Toggle visibility
toggleElementByPermission(userProfile, 'elementId', 'PERMISSION_NAME')

// Apply styling
styleElementByPermission(userProfile, 'elementId', 'PERMISSION_NAME')

// Check access
canAccessVendorManager(userProfile)
canAccessMarketplace(userProfile)
canMakePurchases(userProfile)
canManageVendors(userProfile)
```

### Database Queries
```javascript
// Get users by role
getUsersByRole('vendor_premium', db)

// Get all vendors
getAllVendors(db)

// Get all buyers
getAllBuyers(db)
```

---

## Troubleshooting

### Problem: Upload sections not showing in light blue
**Solution**: Make sure you've imported `permissions.js` and called `styleElementByPermission()` on your upload form elements.

### Problem: Users can't see vendor-manager.html
**Solution**: Verify the user has role `vendor_premium`, `vendor_standard`, or `platform_admin`. Other roles should be redirected.

### Problem: Test users not working
**Solution**: 
1. Verify email/password match exactly (case-sensitive)
2. Check that `test-users.js` is in the `js/` folder
3. Verify auth is initialized before checking permissions

### Problem: Permissions not updating after role change
**Solution**: 
1. Call `initializeUserProfile()` again to sync
2. Refresh the page
3. Check Firestore has the updated role

---

## Next Phase: Advanced Features

### 1. Payment Integration
```javascript
// Track transactions per vendor
{
    transactionId: "txn_123",
    vendorId: "vendor_uid",
    amount: 1500,
    commission: 150,
    netPayout: 1350,
    date: Timestamp
}
```

### 2. Order Management
```javascript
// Orders collection with vendor tracking
{
    orderId: "order_123",
    buyerId: "buyer_uid",
    vendorId: "vendor_uid",
    items: [...],
    status: "pending/approved/shipped/delivered",
    totalAmount: 1500,
    createdAt: Timestamp
}
```

### 3. Notifications
```javascript
// Send to vendors on new orders
sendVendorNotification(vendorId, "New order from buyer", orderDetails)

// Send to buyers on shipment
sendBuyerNotification(buyerId, "Order shipped", trackingInfo)
```

### 4. Analytics Dashboard
```javascript
// Vendor-specific metrics
{
    vendorId: "vendor_uid",
    totalProducts: 45,
    totalSales: 15000,
    totalRevenue: 15000,
    commissionPaid: 1500,
    topProducts: [...],
    period: "month"
}
```

---

## Support & Documentation

- **Permission Reference**: See `ROLES_AND_PERMISSIONS.md`
- **Test Accounts**: See `js/test-users.js`
- **Permission Logic**: See `js/permissions.js`
- **Firebase Integration**: See `js/auth-helper.js`

For questions or issues, refer to the commented code in each module.
