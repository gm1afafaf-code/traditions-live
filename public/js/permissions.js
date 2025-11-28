/**
 * Traditions - User Permissions & Roles System
 * Defines all role-based access control across the platform
 */

// ============================================
// ROLE DEFINITIONS
// ============================================

export const ROLES = {
    // Admin roles
    PLATFORM_ADMIN: 'platform_admin',        // Full platform access (owner/developer)
    VENDOR_MANAGER: 'vendor_manager',        // Can manage vendors, approve listings, view sales
    
    // Vendor roles (sellers)
    VENDOR_PREMIUM: 'vendor_premium',        // Full vendor capabilities with all upload features
    VENDOR_STANDARD: 'vendor_standard',      // Limited vendor capabilities
    VENDOR_TRIAL: 'vendor_trial',            // Trial vendor with restricted uploads
    
    // Buyer roles
    BUYER_COMMERCIAL: 'buyer_commercial',    // B2B buyer (wholesale)
    BUYER_RETAIL: 'buyer_retail',            // Retail buyer
    BUYER_TRIAL: 'buyer_trial',              // Trial buyer with view-only access
    
    // Access-only roles
    MARKETPLACE_VIEWER: 'marketplace_viewer' // View marketplace but cannot buy
};

// ============================================
// PERMISSION MATRICES
// ============================================

/**
 * Define all available permissions in the system
 */
export const PERMISSIONS = {
    // Upload & Product Management
    UPLOAD_PRODUCTS: 'upload_products',
    UPLOAD_BULK_PRODUCTS: 'upload_bulk_products',
    EDIT_PRODUCTS: 'edit_products',
    DELETE_PRODUCTS: 'delete_products',
    VIEW_UPLOAD_DASHBOARD: 'view_upload_dashboard',
    
    // Marketplace Access
    VIEW_MARKETPLACE: 'view_marketplace',
    SEARCH_PRODUCTS: 'search_products',
    VIEW_PRODUCT_DETAILS: 'view_product_details',
    
    // Purchasing & Transactions
    CREATE_OFFERS: 'create_offers',
    MAKE_PURCHASES: 'make_purchases',
    VIEW_CART: 'view_cart',
    
    // Inventory Management
    MANAGE_INVENTORY: 'manage_inventory',
    VIEW_INVENTORY: 'view_inventory',
    
    // Reporting & Analytics
    VIEW_SALES_REPORTS: 'view_sales_reports',
    VIEW_PURCHASE_HISTORY: 'view_purchase_history',
    VIEW_ANALYTICS: 'view_analytics',
    
    // Vendor Management (admin only)
    MANAGE_VENDORS: 'manage_vendors',
    APPROVE_LISTINGS: 'approve_listings',
    VIEW_ALL_SALES: 'view_all_sales',
    MANAGE_PLATFORM: 'manage_platform',
    
    // Account Management
    VIEW_ACCOUNT: 'view_account',
    EDIT_ACCOUNT: 'edit_account',
    VIEW_LICENSE_INFO: 'view_license_info'
};

// ============================================
// ROLE PERMISSION MAPPINGS
// ============================================

export const rolePermissions = {
    [ROLES.PLATFORM_ADMIN]: [
        // Full access to everything
        PERMISSIONS.UPLOAD_PRODUCTS,
        PERMISSIONS.UPLOAD_BULK_PRODUCTS,
        PERMISSIONS.EDIT_PRODUCTS,
        PERMISSIONS.DELETE_PRODUCTS,
        PERMISSIONS.VIEW_UPLOAD_DASHBOARD,
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.CREATE_OFFERS,
        PERMISSIONS.MAKE_PURCHASES,
        PERMISSIONS.VIEW_CART,
        PERMISSIONS.MANAGE_INVENTORY,
        PERMISSIONS.VIEW_INVENTORY,
        PERMISSIONS.VIEW_SALES_REPORTS,
        PERMISSIONS.VIEW_PURCHASE_HISTORY,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_VENDORS,
        PERMISSIONS.APPROVE_LISTINGS,
        PERMISSIONS.VIEW_ALL_SALES,
        PERMISSIONS.MANAGE_PLATFORM,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.EDIT_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.VENDOR_MANAGER]: [
        // Management and approval capabilities
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.MANAGE_VENDORS,
        PERMISSIONS.APPROVE_LISTINGS,
        PERMISSIONS.VIEW_ALL_SALES,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.EDIT_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.VENDOR_PREMIUM]: [
        // Full vendor capabilities
        PERMISSIONS.UPLOAD_PRODUCTS,
        PERMISSIONS.UPLOAD_BULK_PRODUCTS,
        PERMISSIONS.EDIT_PRODUCTS,
        PERMISSIONS.DELETE_PRODUCTS,
        PERMISSIONS.VIEW_UPLOAD_DASHBOARD,
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.MANAGE_INVENTORY,
        PERMISSIONS.VIEW_INVENTORY,
        PERMISSIONS.VIEW_SALES_REPORTS,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.EDIT_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.VENDOR_STANDARD]: [
        // Limited vendor capabilities
        PERMISSIONS.UPLOAD_PRODUCTS,
        PERMISSIONS.EDIT_PRODUCTS,
        PERMISSIONS.VIEW_UPLOAD_DASHBOARD,
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.MANAGE_INVENTORY,
        PERMISSIONS.VIEW_INVENTORY,
        PERMISSIONS.VIEW_SALES_REPORTS,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.EDIT_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.VENDOR_TRIAL]: [
        // Trial vendor - limited uploads
        PERMISSIONS.UPLOAD_PRODUCTS,  // Limited to 5 products
        PERMISSIONS.VIEW_UPLOAD_DASHBOARD,
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.VIEW_INVENTORY,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.BUYER_COMMERCIAL]: [
        // B2B buyer with full purchasing
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.CREATE_OFFERS,
        PERMISSIONS.MAKE_PURCHASES,
        PERMISSIONS.VIEW_CART,
        PERMISSIONS.VIEW_PURCHASE_HISTORY,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.EDIT_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.BUYER_RETAIL]: [
        // Retail buyer with purchasing
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.MAKE_PURCHASES,
        PERMISSIONS.VIEW_CART,
        PERMISSIONS.VIEW_PURCHASE_HISTORY,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.EDIT_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.BUYER_TRIAL]: [
        // Trial buyer - view only
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS,
        PERMISSIONS.VIEW_ACCOUNT,
        PERMISSIONS.VIEW_LICENSE_INFO
    ],
    
    [ROLES.MARKETPLACE_VIEWER]: [
        // Public marketplace access only
        PERMISSIONS.VIEW_MARKETPLACE,
        PERMISSIONS.SEARCH_PRODUCTS,
        PERMISSIONS.VIEW_PRODUCT_DETAILS
    ]
};

// ============================================
// LICENSE TYPE MAPPINGS
// ============================================

/**
 * Map license types to default roles
 * This helps auto-assign appropriate roles based on license type
 */
export const licenseTypeToDefaultRole = {
    'Cultivator': ROLES.VENDOR_PREMIUM,
    'Processor': ROLES.VENDOR_PREMIUM,
    'Distributor': ROLES.BUYER_COMMERCIAL,
    'Retailer': ROLES.BUYER_RETAIL,
    'Testing': ROLES.BUYER_TRIAL,
    'Transporter': ROLES.VENDOR_STANDARD,
    'Laboratory': ROLES.VENDOR_STANDARD
};

// ============================================
// PERMISSION CHECKING UTILITIES
// ============================================

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether user has the permission
 */
export function hasPermission(userRole, permission) {
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 * @param {string} userRole - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether user has any of the permissions
 */
export function hasAnyPermission(userRole, permissions) {
    return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user has all specified permissions
 * @param {string} userRole - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether user has all permissions
 */
export function hasAllPermissions(userRole, permissions) {
    return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a role
 * @param {string} userRole - The user's role
 * @returns {string[]} - Array of all permissions for the role
 */
export function getPermissionsForRole(userRole) {
    return rolePermissions[userRole] || [];
}

/**
 * Get default role for a license type
 * @param {string} licenseType - The license type
 * @returns {string} - The default role
 */
export function getDefaultRoleForLicense(licenseType) {
    return licenseTypeToDefaultRole[licenseType] || ROLES.MARKETPLACE_VIEWER;
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

/**
 * Get CSS class for showing/hiding upload features
 * Used to highlight vendor-specific upload sections in light blue
 * @param {string} userRole - The user's role
 * @param {string} permission - The feature permission
 * @returns {object} - Object with visibility and styling properties
 */
export function getFeatureVisibility(userRole, permission) {
    const hasAccess = hasPermission(userRole, permission);
    return {
        visible: hasAccess,
        className: hasAccess ? 'bg-blue-50 border-blue-300 border-2' : 'opacity-50 pointer-events-none',
        label: hasAccess ? 'Vendor Feature' : 'Not Available'
    };
}

/**
 * Get role display name for UI
 * @param {string} role - The role key
 * @returns {string} - Human-readable role name
 */
export function getRoleDisplayName(role) {
    const displayNames = {
        [ROLES.PLATFORM_ADMIN]: 'Platform Admin',
        [ROLES.VENDOR_MANAGER]: 'Vendor Manager',
        [ROLES.VENDOR_PREMIUM]: 'Premium Vendor',
        [ROLES.VENDOR_STANDARD]: 'Standard Vendor',
        [ROLES.VENDOR_TRIAL]: 'Trial Vendor',
        [ROLES.BUYER_COMMERCIAL]: 'Commercial Buyer (B2B)',
        [ROLES.BUYER_RETAIL]: 'Retail Buyer',
        [ROLES.BUYER_TRIAL]: 'Trial Buyer',
        [ROLES.MARKETPLACE_VIEWER]: 'Marketplace Viewer'
    };
    return displayNames[role] || role;
}
