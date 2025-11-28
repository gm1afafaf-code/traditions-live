/**
 * Authentication & Authorization Helper
 * Manages user roles and permissions in Firebase
 */

import { 
    collection, 
    query, 
    where, 
    getDocs, 
    setDoc, 
    doc, 
    getDoc,
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { TEST_USERS } from './test-users.js';
import { ROLES, hasPermission, getDefaultRoleForLicense } from './permissions.js';

/**
 * Initialize or get user profile from Firestore
 * @param {Object} firebaseUser - Firebase auth user object
 * @param {Object} db - Firestore database reference
 * @returns {Object} - User profile with role and permissions
 */
export async function initializeUserProfile(firebaseUser, db) {
    try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        }

        // Check if this is a test user
        const testUser = Object.values(TEST_USERS).find(
            u => u.email.toLowerCase() === firebaseUser.email.toLowerCase()
        );

        if (testUser) {
            // Create profile for test user
            const userProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: testUser.displayName,
                licenseNumber: testUser.licenseNumber,
                licenseType: testUser.licenseType,
                role: testUser.role,
                permissions: getPermissionsForRole(testUser.role),
                canUpload: testUser.canUpload,
                canBuy: testUser.canBuy,
                canManageVendors: testUser.canManageVendors,
                createdAt: new Date(),
                isTestUser: true
            };

            // Store in Firestore
            await setDoc(userRef, userProfile);
            return userProfile;
        }

        // For new real users, create basic profile
        const userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: ROLES.MARKETPLACE_VIEWER,
            permissions: getPermissionsForRole(ROLES.MARKETPLACE_VIEWER),
            canUpload: false,
            canBuy: false,
            canManageVendors: false,
            createdAt: new Date(),
            isTestUser: false,
            needsApproval: true
        };

        await setDoc(userRef, userProfile);
        return userProfile;

    } catch (error) {
        console.error('Error initializing user profile:', error);
        throw error;
    }
}

/**
 * Get user permissions from Firestore
 * @param {string} uid - User ID
 * @param {Object} db - Firestore database reference
 * @returns {Object} - User profile with permissions
 */
export async function getUserProfile(uid, db) {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

/**
 * Update user role and permissions
 * @param {string} uid - User ID
 * @param {string} newRole - New role
 * @param {Object} db - Firestore database reference
 * @returns {Object} - Updated user profile
 */
export async function updateUserRole(uid, newRole, db) {
    try {
        const userRef = doc(db, 'users', uid);
        
        const updateData = {
            role: newRole,
            permissions: getPermissionsForRole(newRole),
            updatedAt: new Date()
        };

        // Update permission flags based on role
        if (newRole.includes('vendor')) {
            updateData.canUpload = true;
        } else {
            updateData.canUpload = false;
        }

        if (newRole.includes('buyer') || newRole.includes('vendor')) {
            updateData.canBuy = true;
        } else {
            updateData.canBuy = false;
        }

        if (newRole.includes('admin') || newRole.includes('manager')) {
            updateData.canManageVendors = true;
        } else {
            updateData.canManageVendors = false;
        }

        await updateDoc(userRef, updateData);
        
        return {
            ...(await getUserProfile(uid, db)),
            ...updateData
        };
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
}

/**
 * Get permissions for a role
 * @param {string} role - User role
 * @returns {string[]} - Array of permission strings
 */
export function getPermissionsForRole(role) {
    const permissionsMap = {
        [ROLES.PLATFORM_ADMIN]: [
            'UPLOAD_PRODUCTS',
            'UPLOAD_BULK_PRODUCTS',
            'EDIT_PRODUCTS',
            'DELETE_PRODUCTS',
            'VIEW_UPLOAD_DASHBOARD',
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'CREATE_OFFERS',
            'MAKE_PURCHASES',
            'VIEW_CART',
            'MANAGE_INVENTORY',
            'VIEW_INVENTORY',
            'VIEW_SALES_REPORTS',
            'VIEW_PURCHASE_HISTORY',
            'VIEW_ANALYTICS',
            'MANAGE_VENDORS',
            'APPROVE_LISTINGS',
            'VIEW_ALL_SALES',
            'MANAGE_PLATFORM',
            'VIEW_ACCOUNT',
            'EDIT_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.VENDOR_MANAGER]: [
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'MANAGE_VENDORS',
            'APPROVE_LISTINGS',
            'VIEW_ALL_SALES',
            'VIEW_ANALYTICS',
            'VIEW_ACCOUNT',
            'EDIT_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.VENDOR_PREMIUM]: [
            'UPLOAD_PRODUCTS',
            'UPLOAD_BULK_PRODUCTS',
            'EDIT_PRODUCTS',
            'DELETE_PRODUCTS',
            'VIEW_UPLOAD_DASHBOARD',
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'MANAGE_INVENTORY',
            'VIEW_INVENTORY',
            'VIEW_SALES_REPORTS',
            'VIEW_ACCOUNT',
            'EDIT_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.VENDOR_STANDARD]: [
            'UPLOAD_PRODUCTS',
            'EDIT_PRODUCTS',
            'VIEW_UPLOAD_DASHBOARD',
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'MANAGE_INVENTORY',
            'VIEW_INVENTORY',
            'VIEW_SALES_REPORTS',
            'VIEW_ACCOUNT',
            'EDIT_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.VENDOR_TRIAL]: [
            'UPLOAD_PRODUCTS',
            'VIEW_UPLOAD_DASHBOARD',
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'VIEW_INVENTORY',
            'VIEW_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.BUYER_COMMERCIAL]: [
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'CREATE_OFFERS',
            'MAKE_PURCHASES',
            'VIEW_CART',
            'VIEW_PURCHASE_HISTORY',
            'VIEW_ACCOUNT',
            'EDIT_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.BUYER_RETAIL]: [
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'MAKE_PURCHASES',
            'VIEW_CART',
            'VIEW_PURCHASE_HISTORY',
            'VIEW_ACCOUNT',
            'EDIT_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.BUYER_TRIAL]: [
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS',
            'VIEW_ACCOUNT',
            'VIEW_LICENSE_INFO'
        ],
        [ROLES.MARKETPLACE_VIEWER]: [
            'VIEW_MARKETPLACE',
            'SEARCH_PRODUCTS',
            'VIEW_PRODUCT_DETAILS'
        ]
    };

    return permissionsMap[role] || [];
}

/**
 * Check if user has permission
 * @param {Object} userProfile - User profile object
 * @param {string} permission - Permission to check
 * @returns {boolean} - Whether user has permission
 */
export function userHasPermission(userProfile, permission) {
    if (!userProfile || !userProfile.permissions) return false;
    return userProfile.permissions.includes(permission);
}

/**
 * Check if user can access vendor manager
 * @param {Object} userProfile - User profile object
 * @returns {boolean} - Whether user can upload products
 */
export function canAccessVendorManager(userProfile) {
    return userHasPermission(userProfile, 'UPLOAD_PRODUCTS');
}

/**
 * Check if user can access marketplace
 * @param {Object} userProfile - User profile object
 * @returns {boolean} - Whether user can view marketplace
 */
export function canAccessMarketplace(userProfile) {
    return userHasPermission(userProfile, 'VIEW_MARKETPLACE');
}

/**
 * Check if user can make purchases
 * @param {Object} userProfile - User profile object
 * @returns {boolean} - Whether user can purchase
 */
export function canMakePurchases(userProfile) {
    return userHasPermission(userProfile, 'MAKE_PURCHASES');
}

/**
 * Check if user can manage vendors
 * @param {Object} userProfile - User profile object
 * @returns {boolean} - Whether user can manage vendors
 */
export function canManageVendors(userProfile) {
    return userHasPermission(userProfile, 'MANAGE_VENDORS');
}

/**
 * Redirect based on user permissions
 * @param {Object} userProfile - User profile object
 */
export function redirectBasedOnPermissions(userProfile) {
    if (canAccessVendorManager(userProfile)) {
        // Redirect to vendor manager
        window.location.href = 'vendor-manager.html';
    } else if (canAccessMarketplace(userProfile)) {
        // Redirect to marketplace
        window.location.href = 'traditions-bulk.html';
    } else if (canManageVendors(userProfile)) {
        // Redirect to admin
        window.location.href = 'vendor-manager.html';
    } else {
        // Default marketplace viewer
        window.location.href = 'traditions-bulk.html';
    }
}

/**
 * Set up permission-based UI visibility
 * @param {Object} userProfile - User profile object
 * @param {string} elementId - Element ID to show/hide
 * @param {string} permission - Required permission
 */
export function toggleElementByPermission(userProfile, elementId, permission) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (userHasPermission(userProfile, permission)) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

/**
 * Apply permission-based styling
 * @param {Object} userProfile - User profile object
 * @param {string} elementId - Element ID to style
 * @param {string} permission - Required permission
 */
export function styleElementByPermission(userProfile, elementId, permission) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (userHasPermission(userProfile, permission)) {
        // Apply vendor feature styling (light blue)
        element.classList.add('bg-sky-50/10', 'border-sky-400', 'border-2');
    } else {
        // Apply disabled styling
        element.classList.add('opacity-50', 'pointer-events-none');
    }
}

/**
 * Get list of all users with a specific role
 * @param {string} role - Role to search for
 * @param {Object} db - Firestore database reference
 * @returns {Object[]} - Array of user profiles
 */
export async function getUsersByRole(role, db) {
    try {
        const q = query(collection(db, 'users'), where('role', '==', role));
        const querySnapshot = await getDocs(q);
        
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({
                uid: doc.id,
                ...doc.data()
            });
        });

        return users;
    } catch (error) {
        console.error('Error getting users by role:', error);
        throw error;
    }
}

/**
 * Get list of all vendors
 * @param {Object} db - Firestore database reference
 * @returns {Object[]} - Array of vendor profiles
 */
export async function getAllVendors(db) {
    try {
        const vendorRoles = [
            ROLES.VENDOR_PREMIUM,
            ROLES.VENDOR_STANDARD,
            ROLES.VENDOR_TRIAL
        ];

        let vendors = [];
        for (let role of vendorRoles) {
            vendors = vendors.concat(await getUsersByRole(role, db));
        }

        return vendors;
    } catch (error) {
        console.error('Error getting all vendors:', error);
        throw error;
    }
}

/**
 * Get list of all buyers
 * @param {Object} db - Firestore database reference
 * @returns {Object[]} - Array of buyer profiles
 */
export async function getAllBuyers(db) {
    try {
        const buyerRoles = [
            ROLES.BUYER_COMMERCIAL,
            ROLES.BUYER_RETAIL,
            ROLES.BUYER_TRIAL
        ];

        let buyers = [];
        for (let role of buyerRoles) {
            buyers = buyers.concat(await getUsersByRole(role, db));
        }

        return buyers;
    } catch (error) {
        console.error('Error getting all buyers:', error);
        throw error;
    }
}
