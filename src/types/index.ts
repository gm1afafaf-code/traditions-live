// Core User Types
export type UserRole = 'admin' | 'employee' | 'broker';
export type BusinessType = 'Processor' | 'Distributor' | 'Cultivator';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  companyName: string;
  businessType: BusinessType;
  role: UserRole;
  approved: boolean;
  createdAt: Date;
  lastSignIn: Date;
  photoURL?: string;
}

export interface PendingAccount {
  id?: string;
  licenseNumber: string;
  companyName: string;
  email: string;
  businessType: BusinessType;
  status: ApprovalStatus;
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

// Inventory Types
export type ProductType = 'Flower' | 'Concentrate' | 'Edible' | 'Tincture' | 'Oil' | 'Materials';
export type QualityGrade = 'INDOOR' | 'LIGHT_ASSISTED' | 'OUTDOOR';
export type Unit = 'oz' | 'gram' | 'pound' | 'each';

export interface Product {
  id?: string;
  name: string;
  type: ProductType;
  description?: string;
  thc?: number;
  cbd?: number;
  quality?: QualityGrade;
  price: number;
  unit: Unit;
  stock: number;
  minOrder?: number;
  companyId: string;
  companyName: string;
  licenseNumber: string;
  images?: string[];
  coaUrl?: string;
  createdAt: Date;
  lastUpdated: Date;
  active: boolean;
}

// License Types
export interface License {
  licenseNumber: string;
  companyName: string;
  businessType: BusinessType;
  status: 'Active' | 'Inactive' | 'Suspended';
  issuedDate: Date;
  expirationDate: Date;
  address?: string;
  county?: string;
}

export interface LicenseVerificationResult {
  licenseNumber: string;
  companyName: string;
  licenseHolder: string;
  licenseType: string;
  city: string;
  state: string;
  address: string;
  verifiedByGrok?: boolean;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProfileSetupFormData {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  companyName: string;
  businessType: BusinessType;
  phone?: string;
}

export interface ProductFormData {
  name: string;
  type: ProductType;
  description: string;
  thc?: number;
  cbd?: number;
  quality?: QualityGrade;
  price: number;
  unit: Unit;
  stock: number;
  minOrder?: number;
  images?: File[];
  coaUrl?: string;
}

// Filter Types
export interface ProductFilters {
  search?: string;
  type?: ProductType;
  quality?: QualityGrade;
  minPrice?: number;
  maxPrice?: number;
  minTHC?: number;
  maxTHC?: number;
  companyId?: string;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'thc-high' | 'thc-low';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// Analytics Types
export interface DashboardStats {
  totalProducts: number;
  activeListings: number;
  totalVendors: number;
  volumeTraded: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'product_added' | 'product_updated' | 'user_approved' | 'inquiry_received';
  message: string;
  timestamp: Date;
  userId?: string;
  productId?: string;
}
