# Traditions - Roles, Permissions & User Management Guide

## Overview

The Traditions platform now includes a comprehensive role-based access control (RBAC) system that manages vendor sales, buyer access, and marketplace viewing permissions across all license types.

---

## User Roles & Permission Matrix

### 1. **PLATFORM_ADMIN** (System Owner/Developer)
- **Email**: admin@traditions.local  
- **License**: ADMIN-001  
- **Can Upload**: ✅ YES (Full)
- **Can Buy**: ✅ YES
- **Can Manage Vendors**: ✅ YES
- **Primary Capabilities**:
  - Full access to all platform features
  - Manage vendors and approve listings
  - View all sales and analytics
  - System administration
- **Best For**: Development, testing, system management

---

### 2. **VENDOR_MANAGER** (Vendor Administrator)
- **Email**: manager@traditions.local  
- **License**: MGR-001  
- **Can Upload**: ❌ NO
- **Can Buy**: ❌ NO
- **Can Manage Vendors**: ✅ YES
- **Primary Capabilities**:
  - Approve/reject vendor listings
  - View all sales and revenue
  - Manage vendor accounts
  - View platform analytics
- **Best For**: Vendor account management and oversight

---

### 3. **VENDOR_PREMIUM** (Full-Capability Vendor - Sellers)
- **Example License Types**: Cultivator, Processor, Retailer w/ Supply
- **Can Upload**: ✅ YES (Unlimited)
- **Can Buy**: ✅ YES
- **Can Manage Vendors**: ❌ NO
- **Primary Capabilities**:
  - Upload single or bulk products
  - Edit/delete own products
  - View inventory management dashboard
  - View sales reports
  - Access marketplace for bulk buying
- **Best For**: Established vendors with full supply chain capabilities
- **Test Account**: 
  - **GM11788@GMAIL.COM** (Your test vendor account)
  - Password: VendorTest@2025!
  - License: CVAN-001 (Cultivator)

#### **Specific Test Accounts**:
- **Cultivator**: cultivator@traditions.local (grows flower)
- **Processor**: processor@traditions.local (makes concentrates/edibles)

---

### 4. **VENDOR_STANDARD** (Limited Vendor - Sellers)
- **Example License Types**: Transporter, Laboratory
- **Can Upload**: ✅ YES (Limited features)
- **Can Buy**: ✅ YES
- **Can Manage Vendors**: ❌ NO
- **Primary Capabilities**:
  - Upload single products (no bulk)
  - Edit own products
  - View basic inventory
  - View sales reports
  - **RESTRICTIONS**: 
    - Cannot bulk upload
    - Limited product categories
- **Best For**: Secondary vendors or service providers
- **Test Accounts**:
  - **Transporter**: transporter@traditions.local
  - **Laboratory**: laboratory@traditions.local

---

### 5. **VENDOR_TRIAL** (Trial Vendor - Limited Sellers)
- **Email**: trial.vendor@traditions.local  
- **License**: TRIAL-001  
- **Can Upload**: ✅ YES (Max 5 products)
- **Can Buy**: ✅ YES
- **Can Manage Vendors**: ❌ NO
- **Primary Capabilities**:
  - Single product upload only
  - View upload dashboard
  - Browse marketplace
  - **RESTRICTIONS**: 
    - Limited to 5 products total
    - No bulk upload
    - No inventory management
- **Best For**: Testing vendor features before full commitment

---

### 6. **BUYER_COMMERCIAL** (B2B Buyer - Wholesale)
- **Example License Types**: Distributor
- **Email**: distributor@traditions.local  
- **License**: DIST-001  
- **Can Upload**: ❌ NO
- **Can Buy**: ✅ YES (Full)
- **Can Manage Vendors**: ❌ NO
- **Primary Capabilities**:
  - Browse full marketplace
  - Search products by category/price/vendor
  - Create offers on products
  - Make bulk purchases
  - View purchase history
  - Access B2B pricing
- **Best For**: Wholesale buyers and distributors

---

### 7. **BUYER_RETAIL** (Retail Buyer)
- **Example License Types**: Retailer
- **Email**: retailer@traditions.local  
- **License**: RET-001  
- **Can Upload**: ❌ NO
- **Can Buy**: ✅ YES (Retail Only)
- **Can Manage Vendors**: ❌ NO
- **Primary Capabilities**:
  - Browse full marketplace
  - Search products
  - Make retail purchases
  - View purchase history
  - **RESTRICTIONS**: 
    - Cannot create offers (fixed pricing)
    - Standard retail quantities only
- **Best For**: Retail stores and small buyers

---

### 8. **BUYER_TRIAL** (Trial Buyer - View Only)
- **Email**: trial.buyer@traditions.local  
- **License**: TRIAL-B-001  
- **Can Upload**: ❌ NO
- **Can Buy**: ❌ NO (View Only)
- **Can Manage Vendors**: ❌ NO
- **Primary Capabilities**:
  - Browse marketplace
  - Search products
  - View product details
  - **RESTRICTIONS**: 
    - Cannot make purchases
    - View-only access
- **Best For**: Testing buyer features before full account

---

### 9. **MARKETPLACE_VIEWER** (Public Access)
- **Email**: viewer@traditions.local  
- **License**: VIEW-001  
- **Can Upload**: ❌ NO
- **Can Buy**: ❌ NO
- **Can Manage Vendors**: ❌ NO
- **Primary Capabilities**:
  - Browse marketplace
  - Search products
  - View product details
  - **RESTRICTIONS**: 
    - No account required
    - Public viewing only
- **Best For**: General public browsing

---

## Permission Mappings

### **Selling (Upload) Permissions**
```
✅ VENDOR_PREMIUM        → Upload, Bulk Upload, Edit, Delete, Full Dashboard
✅ VENDOR_STANDARD       → Upload (single only), Edit, Basic Dashboard
✅ VENDOR_TRIAL          → Upload (single only, max 5 total)
❌ All Buyers & Public   → No upload access
```

### **Buying (Purchase) Permissions**
```
✅ VENDOR_PREMIUM        → Full marketplace, Can make purchases
✅ VENDOR_STANDARD       → Full marketplace, Can make purchases
✅ VENDOR_TRIAL          → Full marketplace, Can make purchases
✅ BUYER_COMMERCIAL      → Full marketplace, Create offers, Bulk purchases
✅ BUYER_RETAIL          → Full marketplace, Standard purchases only
❌ BUYER_TRIAL           → Marketplace view only
❌ MARKETPLACE_VIEWER    → View only
```

### **Marketplace Access Permissions**
```
✅ All Vendors           → View marketplace
✅ All Buyers            → View marketplace
✅ MARKETPLACE_VIEWER    → View marketplace
```

---

## How to Use Test Accounts

### Testing Vendor Upload Flow
1. Open `vendor-manager.html`
2. Sign in with:
   - Email: `GM11788@GMAIL.COM` (or any vendor account)
   - Password: `VendorTest@2025!`
3. You'll see:
   - Light blue highlighted upload sections (vendor-specific)
   - Single product upload form
   - Bulk upload with AI parsing
   - Inventory dashboard
4. Upload a product and verify it appears in the marketplace

### Testing Buyer Experience
1. Open `traditions-bulk.html` (marketplace)
2. Browse products uploaded by vendors
3. Use buyer accounts to search and view details:
   - `distributor@traditions.local` - Wholesale buyer
   - `retailer@traditions.local` - Retail buyer
   - `trial.buyer@traditions.local` - View only

### Testing Different License Types
Each license type has a dedicated test account:

| License Type | Email | Password |
|---|---|---|
| Cultivator (Vendor) | cultivator@traditions.local | Cultivator@2025! |
| Processor (Vendor) | processor@traditions.local | Processor@2025! |
| Distributor (Buyer) | distributor@traditions.local | Distributor@2025! |
| Retailer (Buyer) | retailer@traditions.local | Retailer@2025! |
| Transporter (Limited Vendor) | transporter@traditions.local | Transporter@2025! |
| Laboratory (Limited Vendor) | laboratory@traditions.local | Laboratory@2025! |
| Trial Vendor | trial.vendor@traditions.local | TrialVendor@2025! |
| Trial Buyer | trial.buyer@traditions.local | TrialBuyer@2025! |
| Platform Admin | admin@traditions.local | AdminPlatform@2025! |
| Vendor Manager | manager@traditions.local | VendorMgr@2025! |

---

## GM11788@GMAIL.COM - Your Vendor Account

**Status**: ✅ **VENDOR_PREMIUM** (Full Access)

### What You Can Do:
1. **Upload Products**
   - Single upload: One product at a time with details, photo
   - Bulk upload: Paste menu text, AI parses it into products
   - Edit your listings
   - Delete products if needed

2. **Manage Inventory**
   - View all your uploaded products
   - Track what's available
   - Update stock levels

3. **View Sales**
   - See who's buying your products
   - Track revenue
   - View purchase history

4. **Browse Marketplace**
   - Find other vendors' products
   - Make your own purchases for wholesale needs

### Upload Features (Light Blue Sections)
The vendor manager page highlights all upload-related features in **light blue**:
- Single product upload form
- Bulk upload textarea and preview
- Inventory management dashboard
- File upload areas
- Deploy buttons

---

## Permission System Architecture

### File Locations
- **Permissions Logic**: `js/permissions.js`
- **Test User Accounts**: `js/test-users.js`
- **Vendor Manager UI**: `vendor-manager.html` (renamed from admin.html)

### JavaScript Functions
```javascript
// Check if user has permission
hasPermission(userRole, 'UPLOAD_PRODUCTS')

// Check multiple permissions
hasAllPermissions(userRole, ['UPLOAD_PRODUCTS', 'EDIT_PRODUCTS'])

// Get all permissions for a role
getPermissionsForRole('vendor_premium')

// Get role for license type
getDefaultRoleForLicense('Cultivator')

// Get UI styling for features
getFeatureVisibility(userRole, 'UPLOAD_PRODUCTS')
```

---

## Next Steps

1. **Set up Firestore Rules** (in security rules):
   ```
   - Vendors can only see/edit their own products
   - Buyers can see all products
   - Non-authenticated users limited view
   ```

2. **Implement Payment Processing**:
   - Connect to Stripe/payment processor
   - Track transactions by vendor
   - Generate revenue reports

3. **Add Email Notifications**:
   - New order notifications for vendors
   - Shipping tracking for buyers
   - Approval notifications from vendor manager

4. **Analytics Dashboard**:
   - Vendor-specific sales metrics
   - Platform-wide analytics
   - Top products/vendors

5. **Admin Controls**:
   - Vendor approval workflow
   - Commission settings
   - Feature flags per role

---

## Troubleshooting

### Issue: Can't upload products
- **Check**: Your role includes `UPLOAD_PRODUCTS` permission
- **Solution**: Verify you're using a vendor account (Premium or Standard)

### Issue: Can't see marketplace
- **Check**: Your role includes `VIEW_MARKETPLACE` permission
- **Solution**: All roles except Platform Admin should have this

### Issue: Can't make purchases
- **Check**: Your role includes `MAKE_PURCHASES` permission
- **Solution**: Buyer roles (Commercial, Retail) have this; Trial buyers do not

### Issue: Test account not working
- **Check**: Email and password are exactly as listed above
- **Solution**: Copy/paste credentials from this guide

---

## Support

For questions about permissions or role setup, refer to:
- `permissions.js` - Permission definitions and utilities
- `test-users.js` - Test account reference
- `vendor-manager.html` - Vendor upload interface
