/**
 * TEST USER IDS FOR ALL LICENSE TYPES
 * Use these accounts to test different role permissions and selling/buying capabilities
 * 
 * Credentials format: email | password | license_type | role | permissions_focus
 */

export const TEST_USERS = {
    // ADMIN & VENDOR MANAGERS
    admin_platform: {
        email: 'admin@traditions.local',
        password: 'AdminPlatform@2025!',
        licenseNumber: 'ADMIN-001',
        licenseType: 'Platform Admin',
        role: 'platform_admin',
        displayName: 'Platform Admin',
        description: 'Full platform access - development and testing only',
        canUpload: true,
        canBuy: true,
        canManageVendors: true
    },
    
    vendor_manager: {
        email: 'manager@traditions.local',
        password: 'VendorMgr@2025!',
        licenseNumber: 'MGR-001',
        licenseType: 'Vendor Manager',
        role: 'vendor_manager',
        displayName: 'Vendor Manager',
        description: 'Manages vendors, approves listings, views sales',
        canUpload: false,
        canBuy: false,
        canManageVendors: true
    },
    
    // PRIMARY VENDOR TEST - GM11788@GMAIL.COM
    vendor_primary_gm: {
        email: 'GM11788@GMAIL.COM',
        password: 'VendorTest@2025!',
        licenseNumber: 'CVAN-001',
        licenseType: 'Cultivator',
        role: 'vendor_premium',
        displayName: 'Test Vendor - GM11788',
        description: 'Premium vendor account for testing upload workflow and vendor experience',
        canUpload: true,
        canBuy: true,
        canManageVendors: false,
        permissions: [
            'UPLOAD_PRODUCTS',
            'UPLOAD_BULK_PRODUCTS',
            'EDIT_PRODUCTS',
            'DELETE_PRODUCTS',
            'VIEW_UPLOAD_DASHBOARD',
            'VIEW_MARKETPLACE',
            'MANAGE_INVENTORY',
            'VIEW_SALES_REPORTS'
        ]
    },
    
    // LICENSE TYPE TEST USERS
    cultivator_vendor: {
        email: 'cultivator@traditions.local',
        password: 'Cultivator@2025!',
        licenseNumber: 'CULT-001',
        licenseType: 'Cultivator',
        role: 'vendor_premium',
        displayName: 'Cultivator Vendor',
        description: 'Grows cannabis - sells flower and other products',
        canUpload: true,
        canBuy: true,
        canManageVendors: false,
        permissionsFocus: 'SELL - Full upload capabilities'
    },
    
    processor_vendor: {
        email: 'processor@traditions.local',
        password: 'Processor@2025!',
        licenseNumber: 'PROC-001',
        licenseType: 'Processor',
        role: 'vendor_premium',
        displayName: 'Processor Vendor',
        description: 'Processes cannabis - sells concentrates, edibles, etc.',
        canUpload: true,
        canBuy: true,
        canManageVendors: false,
        permissionsFocus: 'SELL - Full upload capabilities'
    },
    
    distributor_buyer: {
        email: 'distributor@traditions.local',
        password: 'Distributor@2025!',
        licenseNumber: 'DIST-001',
        licenseType: 'Distributor',
        role: 'buyer_commercial',
        displayName: 'Distributor Buyer',
        description: 'Buys products to distribute - can make bulk purchases',
        canUpload: false,
        canBuy: true,
        canManageVendors: false,
        permissionsFocus: 'BUY - Commercial purchasing with offers'
    },
    
    retailer_buyer: {
        email: 'retailer@traditions.local',
        password: 'Retailer@2025!',
        licenseNumber: 'RET-001',
        licenseType: 'Retailer',
        role: 'buyer_retail',
        displayName: 'Retailer Buyer',
        description: 'Retail shop - buys products for resale',
        canUpload: false,
        canBuy: true,
        canManageVendors: false,
        permissionsFocus: 'BUY - Retail purchasing'
    },
    
    transporter_vendor: {
        email: 'transporter@traditions.local',
        password: 'Transporter@2025!',
        licenseNumber: 'TRANS-001',
        licenseType: 'Transporter',
        role: 'vendor_standard',
        displayName: 'Transporter Vendor',
        description: 'Transports products - limited upload capabilities',
        canUpload: true,
        canBuy: true,
        canManageVendors: false,
        permissionsFocus: 'LIMITED SELL - Basic upload'
    },
    
    laboratory_vendor: {
        email: 'laboratory@traditions.local',
        password: 'Laboratory@2025!',
        licenseNumber: 'LAB-001',
        licenseType: 'Laboratory',
        role: 'vendor_standard',
        displayName: 'Laboratory Vendor',
        description: 'Testing facility - can list testing services',
        canUpload: true,
        canBuy: true,
        canManageVendors: false,
        permissionsFocus: 'LIMITED SELL - Testing services'
    },
    
    trial_vendor: {
        email: 'trial.vendor@traditions.local',
        password: 'TrialVendor@2025!',
        licenseNumber: 'TRIAL-001',
        licenseType: 'Trial License',
        role: 'vendor_trial',
        displayName: 'Trial Vendor',
        description: 'New vendor on trial - limited to 5 product uploads',
        canUpload: true,  // Limited
        canBuy: true,
        canManageVendors: false,
        permissionsFocus: 'LIMITED SELL - Max 5 products'
    },
    
    trial_buyer: {
        email: 'trial.buyer@traditions.local',
        password: 'TrialBuyer@2025!',
        licenseNumber: 'TRIAL-B-001',
        licenseType: 'Trial License',
        role: 'buyer_trial',
        displayName: 'Trial Buyer',
        description: 'New buyer on trial - can view marketplace only',
        canUpload: false,
        canBuy: false,  // View only
        canManageVendors: false,
        permissionsFocus: 'ACCESS - Marketplace viewing only'
    },
    
    marketplace_viewer: {
        email: 'viewer@traditions.local',
        password: 'Viewer@2025!',
        licenseNumber: 'VIEW-001',
        licenseType: 'Public Viewer',
        role: 'marketplace_viewer',
        displayName: 'Marketplace Viewer',
        description: 'Public access - can view marketplace products',
        canUpload: false,
        canBuy: false,
        canManageVendors: false,
        permissionsFocus: 'ACCESS - View marketplace'
    }
};

/**
 * QUICK REFERENCE TABLE
 * 
 * LICENSE TYPE | EMAIL | ROLE | CAN UPLOAD | CAN BUY | PRIMARY USE
 * -------------|-------|------|------------|---------|---------------------------
 * Cultivator | cultivator@traditions.local | vendor_premium | YES | YES | Sell flower
 * Processor | processor@traditions.local | vendor_premium | YES | YES | Sell concentrates
 * Distributor | distributor@traditions.local | buyer_commercial | NO | YES | Buy bulk, wholesale
 * Retailer | retailer@traditions.local | buyer_retail | NO | YES | Buy for resale
 * Transporter | transporter@traditions.local | vendor_standard | YES (limited) | YES | Limited inventory
 * Laboratory | laboratory@traditions.local | vendor_standard | YES (limited) | YES | Sell testing services
 * Trial (Vendor) | trial.vendor@traditions.local | vendor_trial | YES (max 5) | YES | Test upload feature
 * Trial (Buyer) | trial.buyer@traditions.local | buyer_trial | NO | NO | View marketplace
 * Public Viewer | viewer@traditions.local | marketplace_viewer | NO | NO | Browse products
 * 
 * SPECIAL ACCOUNT:
 * Primary Test Vendor | GM11788@GMAIL.COM | vendor_premium | YES | YES | Full vendor testing
 */

/**
 * Get test user by email
 * @param {string} email - User email
 * @returns {object} - User object or null
 */
export function getTestUserByEmail(email) {
    return Object.values(TEST_USERS).find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Get test user by license type
 * @param {string} licenseType - License type
 * @returns {object[]} - Array of matching users
 */
export function getTestUsersByLicenseType(licenseType) {
    return Object.values(TEST_USERS).filter(user => user.licenseType === licenseType);
}

/**
 * Get test user by role
 * @param {string} role - User role
 * @returns {object[]} - Array of matching users
 */
export function getTestUsersByRole(role) {
    return Object.values(TEST_USERS).filter(user => user.role === role);
}

/**
 * Get all vendor users (can upload)
 * @returns {object[]} - Array of vendor users
 */
export function getAllVendorUsers() {
    return Object.values(TEST_USERS).filter(user => user.canUpload);
}

/**
 * Get all buyer users (can purchase)
 * @returns {object[]} - Array of buyer users
 */
export function getAllBuyerUsers() {
    return Object.values(TEST_USERS).filter(user => user.canBuy);
}
