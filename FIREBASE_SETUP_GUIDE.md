# Firebase Setup Guide for Traditions Vendor System

## Project: traditions-c1cf5

Your Firebase project is already initialized. Now we need to set up the data structure.

---

## Step 1: Create Firestore Collections

### Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select project: **traditions-c1cf5**
3. Click **Firestore Database** (left sidebar)
4. Ensure database is in **production mode** (or test mode for now)

### Create "users" Collection

1. Click **+ Start Collection**
2. Collection ID: `users`
3. Click **Next**
4. For the first document, you can click **Auto ID** or skip (we'll add documents via code)
5. Click **Save**

**Document Structure** (Reference):
```json
{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "displayName": "User Name",
  "licenseNumber": "LICENSE-001",
  "licenseType": "Cultivator",
  "role": "vendor_premium",
  "permissions": ["UPLOAD_PRODUCTS", "UPLOAD_BULK_PRODUCTS", ...],
  "canUpload": true,
  "canBuy": true,
  "canManageVendors": false,
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "isTestUser": true
}
```

---

## Step 2: Update Firestore Security Rules

1. In Firebase Console, click **Firestore Database** → **Rules** tab
2. Replace all content with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId || 
                      isAdmin(request.auth.uid);
    }

    // Products - all can read, vendors can create/edit their own
    match /inventory/{productId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       hasPermission(request.auth.uid, 'UPLOAD_PRODUCTS');
      allow update, delete: if isProductOwner(productId, request.auth.uid) ||
                               isAdmin(request.auth.uid);
    }

    // Pending accounts for registration
    match /pending_accounts/{docId} {
      allow create: if request.auth == null;
      allow read, update: if isAdmin(request.auth.uid);
    }

    // Helper functions
    function userDoc(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data;
    }

    function userRole(uid) {
      return userDoc(uid).role;
    }

    function hasPermission(uid, permission) {
      return permission in userDoc(uid).permissions;
    }

    function isProductOwner(productId, uid) {
      return get(/databases/$(database)/documents/inventory/$(productId)).data.vendorId == uid;
    }

    function isAdmin(uid) {
      let role = userRole(uid);
      return role == 'platform_admin' || role == 'vendor_manager';
    }
  }
}
```

3. Click **Publish**

---

## Step 3: Set Up Firebase Authentication

### Enable Sign-In Methods

1. Click **Authentication** (left sidebar)
2. Click **Sign-in method** tab
3. Enable:
   - ✅ **Email/Password** (click pencil, toggle ON, Save)
   - ✅ **Google** (add your Google OAuth credentials if needed)

### Create Test User Accounts

**Option A: Manual (via Firebase Console)**

1. Click **Users** tab
2. Click **Add user** (top right)
3. Fill in:
   - Email: `GM11788@GMAIL.COM`
   - Password: `VendorTest@2025!`
4. Click **Create**
5. Repeat for other test accounts (see list below)

**Option B: Automated (via Script - See Step 4)**

---

## Test Accounts to Create

Copy this into Firebase Console (Users → Add user) for each:

```
EMAIL                          PASSWORD              ROLE
────────────────────────────────────────────────────────────
GM11788@GMAIL.COM              VendorTest@2025!      (Your main vendor)
cultivator@traditions.local    Cultivator@2025!      
processor@traditions.local     Processor@2025!       
distributor@traditions.local   Distributor@2025!     
retailer@traditions.local      Retailer@2025!        
transporter@traditions.local   Transporter@2025!     
laboratory@traditions.local    Laboratory@2025!      
trial.vendor@traditions.local  TrialVendor@2025!     
trial.buyer@traditions.local   TrialBuyer@2025!      
admin@traditions.local         AdminPlatform@2025!   
manager@traditions.local       VendorMgr@2025!       
```

---

## Step 4: Automated Setup (Optional but Recommended)

### Create User Initialization Script

Create a file: `setup/initialize-users.js`

```javascript
// This script initializes test users in Firebase
// Run this ONCE to set up all test accounts
// Usage: node initialize-users.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const TEST_USERS = [
  {
    email: 'GM11788@GMAIL.COM',
    password: 'VendorTest@2025!',
    displayName: 'Test Vendor - GM11788',
    licenseNumber: 'CVAN-001',
    licenseType: 'Cultivator',
    role: 'vendor_premium'
  },
  {
    email: 'cultivator@traditions.local',
    password: 'Cultivator@2025!',
    displayName: 'Cultivator Vendor',
    licenseNumber: 'CULT-001',
    licenseType: 'Cultivator',
    role: 'vendor_premium'
  },
  {
    email: 'processor@traditions.local',
    password: 'Processor@2025!',
    displayName: 'Processor Vendor',
    licenseNumber: 'PROC-001',
    licenseType: 'Processor',
    role: 'vendor_premium'
  },
  {
    email: 'distributor@traditions.local',
    password: 'Distributor@2025!',
    displayName: 'Distributor Buyer',
    licenseNumber: 'DIST-001',
    licenseType: 'Distributor',
    role: 'buyer_commercial'
  },
  {
    email: 'retailer@traditions.local',
    password: 'Retailer@2025!',
    displayName: 'Retailer Buyer',
    licenseNumber: 'RET-001',
    licenseType: 'Retailer',
    role: 'buyer_retail'
  },
  {
    email: 'transporter@traditions.local',
    password: 'Transporter@2025!',
    displayName: 'Transporter Vendor',
    licenseNumber: 'TRANS-001',
    licenseType: 'Transporter',
    role: 'vendor_standard'
  },
  {
    email: 'laboratory@traditions.local',
    password: 'Laboratory@2025!',
    displayName: 'Laboratory Vendor',
    licenseNumber: 'LAB-001',
    licenseType: 'Laboratory',
    role: 'vendor_standard'
  },
  {
    email: 'trial.vendor@traditions.local',
    password: 'TrialVendor@2025!',
    displayName: 'Trial Vendor',
    licenseNumber: 'TRIAL-001',
    licenseType: 'Trial License',
    role: 'vendor_trial'
  },
  {
    email: 'trial.buyer@traditions.local',
    password: 'TrialBuyer@2025!',
    displayName: 'Trial Buyer',
    licenseNumber: 'TRIAL-B-001',
    licenseType: 'Trial License',
    role: 'buyer_trial'
  },
  {
    email: 'admin@traditions.local',
    password: 'AdminPlatform@2025!',
    displayName: 'Platform Admin',
    licenseNumber: 'ADMIN-001',
    licenseType: 'Platform Admin',
    role: 'platform_admin'
  },
  {
    email: 'manager@traditions.local',
    password: 'VendorMgr@2025!',
    displayName: 'Vendor Manager',
    licenseNumber: 'MGR-001',
    licenseType: 'Vendor Manager',
    role: 'vendor_manager'
  }
];

async function createUsers() {
  console.log('Starting user creation...\n');
  
  for (const user of TEST_USERS) {
    try {
      // Create auth user
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName
      });
      
      console.log(`✓ Created user: ${user.email}`);
      
      // Add to Firestore users collection
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: user.email,
        displayName: user.displayName,
        licenseNumber: user.licenseNumber,
        licenseType: user.licenseType,
        role: user.role,
        permissions: getPermissionsForRole(user.role),
        canUpload: ['vendor_premium', 'vendor_standard', 'vendor_trial', 'platform_admin'].includes(user.role),
        canBuy: ['vendor_premium', 'vendor_standard', 'vendor_trial', 'buyer_commercial', 'buyer_retail', 'platform_admin'].includes(user.role),
        canManageVendors: ['vendor_manager', 'platform_admin'].includes(user.role),
        createdAt: new Date(),
        isTestUser: true
      });
      
      console.log(`✓ Added to Firestore: ${user.email}\n`);
    } catch (error) {
      console.error(`✗ Error creating ${user.email}:`, error.message);
    }
  }
  
  console.log('User creation complete!');
  process.exit(0);
}

function getPermissionsForRole(role) {
  const permissions = {
    platform_admin: [
      'UPLOAD_PRODUCTS', 'UPLOAD_BULK_PRODUCTS', 'EDIT_PRODUCTS', 'DELETE_PRODUCTS',
      'VIEW_UPLOAD_DASHBOARD', 'VIEW_MARKETPLACE', 'SEARCH_PRODUCTS', 'VIEW_PRODUCT_DETAILS',
      'CREATE_OFFERS', 'MAKE_PURCHASES', 'VIEW_CART', 'MANAGE_INVENTORY', 'VIEW_INVENTORY',
      'VIEW_SALES_REPORTS', 'VIEW_PURCHASE_HISTORY', 'VIEW_ANALYTICS', 'MANAGE_VENDORS',
      'APPROVE_LISTINGS', 'VIEW_ALL_SALES', 'MANAGE_PLATFORM', 'VIEW_ACCOUNT', 'EDIT_ACCOUNT',
      'VIEW_LICENSE_INFO'
    ],
    vendor_manager: [
      'VIEW_MARKETPLACE', 'SEARCH_PRODUCTS', 'VIEW_PRODUCT_DETAILS', 'MANAGE_VENDORS',
      'APPROVE_LISTINGS', 'VIEW_ALL_SALES', 'VIEW_ANALYTICS', 'VIEW_ACCOUNT', 'EDIT_ACCOUNT',
      'VIEW_LICENSE_INFO'
    ],
    vendor_premium: [
      'UPLOAD_PRODUCTS', 'UPLOAD_BULK_PRODUCTS', 'EDIT_PRODUCTS', 'DELETE_PRODUCTS',
      'VIEW_UPLOAD_DASHBOARD', 'VIEW_MARKETPLACE', 'SEARCH_PRODUCTS', 'VIEW_PRODUCT_DETAILS',
      'MANAGE_INVENTORY', 'VIEW_INVENTORY', 'VIEW_SALES_REPORTS', 'VIEW_ACCOUNT', 'EDIT_ACCOUNT',
      'VIEW_LICENSE_INFO'
    ],
    vendor_standard: [
      'UPLOAD_PRODUCTS', 'EDIT_PRODUCTS', 'VIEW_UPLOAD_DASHBOARD', 'VIEW_MARKETPLACE',
      'SEARCH_PRODUCTS', 'VIEW_PRODUCT_DETAILS', 'MANAGE_INVENTORY', 'VIEW_INVENTORY',
      'VIEW_SALES_REPORTS', 'VIEW_ACCOUNT', 'EDIT_ACCOUNT', 'VIEW_LICENSE_INFO'
    ],
    vendor_trial: [
      'UPLOAD_PRODUCTS', 'VIEW_UPLOAD_DASHBOARD', 'VIEW_MARKETPLACE', 'SEARCH_PRODUCTS',
      'VIEW_PRODUCT_DETAILS', 'VIEW_INVENTORY', 'VIEW_ACCOUNT', 'VIEW_LICENSE_INFO'
    ],
    buyer_commercial: [
      'VIEW_MARKETPLACE', 'SEARCH_PRODUCTS', 'VIEW_PRODUCT_DETAILS', 'CREATE_OFFERS',
      'MAKE_PURCHASES', 'VIEW_CART', 'VIEW_PURCHASE_HISTORY', 'VIEW_ACCOUNT', 'EDIT_ACCOUNT',
      'VIEW_LICENSE_INFO'
    ],
    buyer_retail: [
      'VIEW_MARKETPLACE', 'SEARCH_PRODUCTS', 'VIEW_PRODUCT_DETAILS', 'MAKE_PURCHASES',
      'VIEW_CART', 'VIEW_PURCHASE_HISTORY', 'VIEW_ACCOUNT', 'EDIT_ACCOUNT', 'VIEW_LICENSE_INFO'
    ],
    buyer_trial: [
      'VIEW_MARKETPLACE', 'SEARCH_PRODUCTS', 'VIEW_PRODUCT_DETAILS', 'VIEW_ACCOUNT', 'VIEW_LICENSE_INFO'
    ]
  };
  
  return permissions[role] || [];
}

createUsers();
```

### To Use This Script:

1. **Download Service Account Key**:
   - Firebase Console → Settings (⚙️) → Service Accounts
   - Click **Generate New Private Key**
   - Save as `serviceAccountKey.json` in `setup/` folder

2. **Install Firebase Admin SDK**:
   ```bash
   npm install firebase-admin
   ```

3. **Run the script**:
   ```bash
   node setup/initialize-users.js
   ```

---

## Verification Checklist

After completing the setup, verify:

- [ ] Firestore `users` collection exists
- [ ] Security rules are published
- [ ] Firebase Auth has sign-in methods enabled (Email/Password, Google)
- [ ] At least one test user can sign in
- [ ] Products collection has vendor metadata (vendorId, vendorEmail, vendorName)

### Quick Test:

1. Open `vendor-manager.html`
2. Sign in with: `GM11788@GMAIL.COM` / `VendorTest@2025!`
3. Try to upload a product
4. Check Firestore Console - see new product with vendor info

---

## Troubleshooting

### "Permission denied" error
→ Check Firestore security rules are published correctly

### "User not found"
→ Create test users in Firebase Auth first

### Products not appearing
→ Check `inventory` collection permissions in security rules

### Can't write to users collection
→ Ensure current user is authenticated in auth-helper.js

---

## Next Steps

1. ✅ Create Firestore collections (users, inventory, pending_accounts)
2. ✅ Set Firestore security rules
3. ✅ Create test user accounts
4. ⏭️ Test vendor-manager.html upload flow
5. ⏭️ Test marketplace visibility by role
6. ⏭️ Set up payment processing (future)
