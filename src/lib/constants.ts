// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  PENDING_ACCOUNTS: 'pending_accounts',
  INVENTORY: 'inventory',
  ADMIN_LOGS: 'admin_logs',
  INQUIRIES: 'inquiries',
  FAVORITES: 'favorites',
} as const;

// Business Types
export const BUSINESS_TYPES = ['Processor', 'Distributor', 'Cultivator'] as const;

// Product Types
export const PRODUCT_TYPES = [
  'Flower',
  'Concentrate',
  'Edible',
  'Tincture',
  'Oil',
  'Materials',
] as const;

// Quality Grades
export const QUALITY_GRADES = ['INDOOR', 'LIGHT_ASSISTED', 'OUTDOOR'] as const;

// Units
export const UNITS = ['oz', 'gram', 'pound', 'each'] as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  BROKER: 'broker',
} as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'thc-high', label: 'THC: High to Low' },
  { value: 'thc-low', label: 'THC: Low to High' },
] as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE_SETUP: '/profile-setup',
  PENDING_APPROVAL: '/pending-approval',
  VAULT: '/vault',
  PRODUCT_DETAIL: '/product/:id',
  ADMIN_DASHBOARD: '/admin',
  EMPLOYEE_DASHBOARD: '/employee',
  BROKER_DASHBOARD: '/broker',
  VENDOR_PORTAL: '/vendor',
  SETTINGS: '/settings',
  COMPLIANCE: '/compliance',
  NETWORK: '/network',
  TRACKING: '/tracking',
  COMPLIANCE_PORTAL: '/portal/compliance',
  TRACKING_PORTAL: '/portal/tracking',
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_PRODUCT: 5,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'vouched-theme',
  SIDEBAR_COLLAPSED: 'vouched-sidebar-collapsed',
  LAST_VIEWED_PRODUCTS: 'vouched-last-viewed',
} as const;
