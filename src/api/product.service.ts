import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import type { Product, ProductFormData, ProductFilters, PaginatedResponse } from '@/types';

/**
 * Convert Firestore timestamp to Date
 */
function timestampToDate(timestamp: unknown): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const productDoc = await getDoc(doc(db, COLLECTIONS.INVENTORY, id));

    if (!productDoc.exists()) {
      return null;
    }

    const data = productDoc.data();
    return {
      id: productDoc.id,
      name: data.name,
      type: data.type,
      description: data.description,
      thc: data.thc,
      cbd: data.cbd,
      quality: data.quality,
      price: data.price,
      unit: data.unit,
      stock: data.stock,
      minOrder: data.minOrder,
      companyId: data.companyId,
      companyName: data.companyName,
      licenseNumber: data.licenseNumber,
      images: data.images || [],
      coaUrl: data.coaUrl,
      createdAt: timestampToDate(data.createdAt),
      lastUpdated: timestampToDate(data.lastUpdated),
      active: data.active !== false,
    };
  } catch (error) {
    console.error('Error getting product:', error);
    throw new Error('Failed to fetch product');
  }
}

/**
 * Get products with filters and pagination
 */
export async function getProducts(
  filters: ProductFilters = {},
  page = 1,
  pageLimit = 20,
  lastDoc?: unknown
): Promise<PaginatedResponse<Product>> {
  try {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters.quality) {
      constraints.push(where('quality', '==', filters.quality));
    }
    if (filters.companyId) {
      constraints.push(where('companyId', '==', filters.companyId));
    }

    // Only show active products
    constraints.push(where('active', '==', true));

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        constraints.push(orderBy('price', 'asc'));
        break;
      case 'price-high':
        constraints.push(orderBy('price', 'desc'));
        break;
      case 'thc-high':
        constraints.push(orderBy('thc', 'desc'));
        break;
      case 'thc-low':
        constraints.push(orderBy('thc', 'asc'));
        break;
      default:
        constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(pageLimit + 1)); // Get one extra to check if there are more

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, COLLECTIONS.INVENTORY), ...constraints);
    const snapshot = await getDocs(q);

    const hasMore = snapshot.docs.length > pageLimit;
    const docs = hasMore ? snapshot.docs.slice(0, -1) : snapshot.docs;

    let products = docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        description: data.description,
        thc: data.thc,
        cbd: data.cbd,
        quality: data.quality,
        price: data.price,
        unit: data.unit,
        stock: data.stock,
        minOrder: data.minOrder,
        companyId: data.companyId,
        companyName: data.companyName,
        licenseNumber: data.licenseNumber,
        images: data.images || [],
        coaUrl: data.coaUrl,
        createdAt: timestampToDate(data.createdAt),
        lastUpdated: timestampToDate(data.lastUpdated),
        active: data.active !== false,
      };
    });

    // Client-side filtering for search and price ranges
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.companyName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.minTHC !== undefined) {
      products = products.filter((p) => (p.thc || 0) >= filters.minTHC!);
    }

    if (filters.maxTHC !== undefined) {
      products = products.filter((p) => (p.thc || 0) <= filters.maxTHC!);
    }

    return {
      items: products,
      total: products.length,
      page,
      limit: pageLimit,
      hasMore,
    };
  } catch (error) {
    console.error('Error getting products:', error);
    // Rethrow original error to preserve Firestore error message (e.g., missing index)
    throw error;
  }
}

/**
 * Create new product
 */
export async function createProduct(
  companyId: string,
  companyName: string,
  licenseNumber: string,
  productData: Partial<ProductFormData> & Pick<ProductFormData, 'name' | 'type' | 'price' | 'unit' | 'stock'>
): Promise<Product> {
  try {
    const product: Omit<Product, 'id'> = {
      name: productData.name,
      type: productData.type,
      description: productData.description || '',
      thc: productData.thc,
      cbd: productData.cbd,
      quality: productData.quality,
      price: productData.price,
      unit: productData.unit,
      stock: productData.stock,
      minOrder: productData.minOrder,
      companyId,
      companyName,
      licenseNumber,
      images: [],
      coaUrl: productData.coaUrl,
      createdAt: new Date(),
      lastUpdated: new Date(),
      active: true,
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.INVENTORY), {
      ...product,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });

    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

/**
 * Update product
 */
export async function updateProduct(id: string, updates: Partial<ProductFormData>): Promise<void> {
  try {
    const productRef = doc(db, COLLECTIONS.INVENTORY, id);
    await updateDoc(productRef, {
      ...updates,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

/**
 * Delete product (soft delete)
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const productRef = doc(db, COLLECTIONS.INVENTORY, id);
    await updateDoc(productRef, {
      active: false,
      deletedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

/**
 * Hard delete product (admin only)
 */
export async function hardDeleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.INVENTORY, id));
  } catch (error) {
    console.error('Error hard deleting product:', error);
    throw new Error('Failed to delete product permanently');
  }
}

/**
 * Get products by company
 */
export async function getProductsByCompany(companyId: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVENTORY),
      where('companyId', '==', companyId),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        description: data.description,
        thc: data.thc,
        cbd: data.cbd,
        quality: data.quality,
        price: data.price,
        unit: data.unit,
        stock: data.stock,
        minOrder: data.minOrder,
        companyId: data.companyId,
        companyName: data.companyName,
        licenseNumber: data.licenseNumber,
        images: data.images || [],
        coaUrl: data.coaUrl,
        createdAt: timestampToDate(data.createdAt),
        lastUpdated: timestampToDate(data.lastUpdated),
        active: data.active !== false,
      };
    });
  } catch (error) {
    console.error('Error getting company products:', error);
    throw new Error('Failed to fetch company products');
  }
}
