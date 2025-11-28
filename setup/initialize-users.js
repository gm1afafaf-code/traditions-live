// Firebase User Initialization Script
// Run this once to create all test users in Firebase Auth and Firestore
// Usage: npm install firebase-admin && node setup/initialize-users.js

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Test users to create
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

// Permission mappings for each role
const PERMISSION_MATRIX = {
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

/**
 * Create all test users
 */
async function createAllUsers() {
  console.log('🚀 Starting Traditions User Initialization...\n');
  console.log('Firebase Project: traditions-c1cf5');
  console.log('Test Users to Create: ' + TEST_USERS.length + '\n');
  console.log('═'.repeat(60));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const user of TEST_USERS) {
    try {
      console.log(`\n📧 Creating: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   License: ${user.licenseNumber} (${user.licenseType})`);
      
      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName
      });
      
      console.log(`   ✓ Auth user created (${userRecord.uid})`);
      
      // Create Firestore user profile
      const permissions = PERMISSION_MATRIX[user.role] || [];
      const profileData = {
        uid: userRecord.uid,
        email: user.email,
        displayName: user.displayName,
        licenseNumber: user.licenseNumber,
        licenseType: user.licenseType,
        role: user.role,
        permissions: permissions,
        canUpload: ['vendor_premium', 'vendor_standard', 'vendor_trial', 'platform_admin'].includes(user.role),
        canBuy: ['vendor_premium', 'vendor_standard', 'vendor_trial', 'buyer_commercial', 'buyer_retail', 'platform_admin'].includes(user.role),
        canManageVendors: ['vendor_manager', 'platform_admin'].includes(user.role),
        createdAt: admin.firestore.Timestamp.now(),
        isTestUser: true
      };
      
      await db.collection('users').doc(userRecord.uid).set(profileData);
      
      console.log(`   ✓ Firestore profile created`);
      console.log(`   ✓ Permissions: ${permissions.length} assigned`);
      
      successCount++;
    } catch (error) {
      console.error(`   ✗ Error: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 INITIALIZATION COMPLETE\n');
  console.log(`✓ Successfully created: ${successCount} users`);
  console.log(`✗ Errors: ${errorCount}`);
  console.log('\n📝 Next Steps:');
  console.log('   1. Open vendor-manager.html');
  console.log('   2. Sign in with: GM11788@GMAIL.COM / VendorTest@2025!');
  console.log('   3. Upload products and test the system');
  console.log('   4. Check traditions-bulk.html for marketplace view');
  
  process.exit(errorCount > 0 ? 1 : 0);
}

// Run initialization
createAllUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
