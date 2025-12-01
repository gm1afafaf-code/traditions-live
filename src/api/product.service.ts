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

// Sample inventory data for when Firestore is unavailable or empty
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'sample-1',
    name: 'Blue Dream',
    type: 'Flower',
    description: 'A sativa-dominant hybrid with sweet berry aroma. Known for full-body relaxation with gentle cerebral invigoration.',
    thc: 24.3,
    cbd: 0.5,
    quality: 'INDOOR',
    price: 2800,
    unit: 'pound',
    stock: 150,
    minOrder: 1,
    companyId: 'vendor-1',
    companyName: 'Hudson Valley Cultivators',
    licenseNumber: 'NYS-CUL-001234',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-2',
    name: 'Purple Punch',
    type: 'Flower',
    description: 'Indica-dominant strain with grape candy and blueberry muffin aromas. Perfect for evening relaxation.',
    thc: 22.1,
    cbd: 0.3,
    quality: 'INDOOR',
    price: 2600,
    unit: 'pound',
    stock: 200,
    minOrder: 1,
    companyId: 'vendor-2',
    companyName: 'Brooklyn Cannabis Co',
    licenseNumber: 'NYS-CUL-002345',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-3',
    name: 'OG Kush',
    type: 'Flower',
    description: 'Classic hybrid with earthy pine and sour lemon scent. Provides heavy euphoria and stress relief.',
    thc: 26.5,
    cbd: 0.2,
    quality: 'INDOOR',
    price: 3200,
    unit: 'pound',
    stock: 75,
    minOrder: 1,
    companyId: 'vendor-1',
    companyName: 'Hudson Valley Cultivators',
    licenseNumber: 'NYS-CUL-001234',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-4',
    name: 'Gelato',
    type: 'Flower',
    description: 'Balanced hybrid with sweet sherbet flavor. Delivers relaxation without heavy sedation.',
    thc: 25.0,
    cbd: 0.4,
    quality: 'INDOOR',
    price: 3000,
    unit: 'pound',
    stock: 120,
    minOrder: 1,
    companyId: 'vendor-3',
    companyName: 'Syracuse Green Gardens',
    licenseNumber: 'NYS-CUL-003456',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-5',
    name: 'Wedding Cake',
    type: 'Flower',
    description: 'Indica-dominant with rich tangy flavor and relaxing effects. High THC content.',
    thc: 27.8,
    cbd: 0.1,
    quality: 'INDOOR',
    price: 3400,
    unit: 'pound',
    stock: 50,
    minOrder: 1,
    companyId: 'vendor-2',
    companyName: 'Brooklyn Cannabis Co',
    licenseNumber: 'NYS-CUL-002345',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-6',
    name: 'Sour Diesel',
    type: 'Flower',
    description: 'Energizing sativa with pungent diesel aroma. Great for daytime use and creativity.',
    thc: 23.5,
    cbd: 0.3,
    quality: 'LIGHT_ASSISTED',
    price: 2400,
    unit: 'pound',
    stock: 180,
    minOrder: 1,
    companyId: 'vendor-4',
    companyName: 'Finger Lakes Farms',
    licenseNumber: 'NYS-CUL-004567',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-7',
    name: 'Live Rosin - Blue Dream',
    type: 'Concentrate',
    description: 'Solventless extract preserving full terpene profile. Premium quality live rosin.',
    thc: 78.5,
    cbd: 1.2,
    quality: 'INDOOR',
    price: 45,
    unit: 'gram',
    stock: 500,
    minOrder: 10,
    companyId: 'vendor-5',
    companyName: 'Empire Extracts',
    licenseNumber: 'NYS-PRO-005678',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-8',
    name: 'Distillate Cartridge - Hybrid',
    type: 'Concentrate',
    description: 'High-purity THC distillate in 510-thread cartridge. Smooth and potent.',
    thc: 92.0,
    cbd: 0.5,
    quality: 'INDOOR',
    price: 25,
    unit: 'each',
    stock: 1000,
    minOrder: 50,
    companyId: 'vendor-5',
    companyName: 'Empire Extracts',
    licenseNumber: 'NYS-PRO-005678',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-9',
    name: 'Gummies - Mixed Fruit',
    type: 'Edible',
    description: '10mg THC per gummy. Assorted fruit flavors. Lab tested for consistency.',
    thc: 10,
    cbd: 0,
    quality: 'INDOOR',
    price: 18,
    unit: 'each',
    stock: 2000,
    minOrder: 100,
    companyId: 'vendor-6',
    companyName: 'NY Edibles Co',
    licenseNumber: 'NYS-PRO-006789',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-10',
    name: 'Full Spectrum Tincture',
    type: 'Tincture',
    description: '1000mg THC per bottle. MCT oil base. Precise dosing with dropper.',
    thc: 33.3,
    cbd: 5.0,
    quality: 'INDOOR',
    price: 55,
    unit: 'each',
    stock: 300,
    minOrder: 20,
    companyId: 'vendor-6',
    companyName: 'NY Edibles Co',
    licenseNumber: 'NYS-PRO-006789',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-11',
    name: 'Runtz',
    type: 'Flower',
    description: 'Exotic hybrid with candy-like sweetness. Balanced effects for any time of day.',
    thc: 24.8,
    cbd: 0.2,
    quality: 'INDOOR',
    price: 3100,
    unit: 'pound',
    stock: 90,
    minOrder: 1,
    companyId: 'vendor-3',
    companyName: 'Syracuse Green Gardens',
    licenseNumber: 'NYS-CUL-003456',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
  {
    id: 'sample-12',
    name: 'Northern Lights',
    type: 'Flower',
    description: 'Pure indica with sweet and spicy aromas. Legendary strain for deep relaxation.',
    thc: 21.0,
    cbd: 0.6,
    quality: 'OUTDOOR',
    price: 1800,
    unit: 'pound',
    stock: 400,
    minOrder: 5,
    companyId: 'vendor-4',
    companyName: 'Finger Lakes Farms',
    licenseNumber: 'NYS-CUL-004567',
    images: [],
    createdAt: new Date(),
    lastUpdated: new Date(),
    active: true,
  },
];

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
    console.error('Error getting products from Firestore, using sample data:', error);
    // Fall back to sample data when Firestore fails (missing index, permissions, etc.)
    return filterSampleProducts(filters, page, pageLimit);
  }
}

/**
 * Filter and paginate sample products (used as fallback)
 */
function filterSampleProducts(
  filters: ProductFilters,
  page: number,
  pageLimit: number
): PaginatedResponse<Product> {
  let products = [...SAMPLE_PRODUCTS];

  // Apply filters
  if (filters.type) {
    products = products.filter((p) => p.type === filters.type);
  }
  if (filters.quality) {
    products = products.filter((p) => p.quality === filters.quality);
  }
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

  // Apply sorting
  switch (filters.sortBy) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'thc-high':
      products.sort((a, b) => (b.thc || 0) - (a.thc || 0));
      break;
    case 'thc-low':
      products.sort((a, b) => (a.thc || 0) - (b.thc || 0));
      break;
    default:
      // newest - already sorted by default
      break;
  }

  // Paginate
  const startIndex = (page - 1) * pageLimit;
  const paginatedProducts = products.slice(startIndex, startIndex + pageLimit);
  const hasMore = startIndex + pageLimit < products.length;

  return {
    items: paginatedProducts,
    total: products.length,
    page,
    limit: pageLimit,
    hasMore,
  };
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
