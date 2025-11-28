import { create } from 'zustand';
import type { Product, ProductFilters, PaginatedResponse } from '@/types';
import { getProducts, getProductById } from '@/api/product.service';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setFilters: (filters: ProductFilters) => void;
  fetchProducts: (page?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearSelectedProduct: () => void;
  resetFilters: () => void;
  clearError: () => void;
}

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  sortBy: 'newest',
};

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  hasMore: false,
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  isLoading: false,
  error: null,

  setFilters: (filters) => {
    set({
      filters: { ...get().filters, ...filters },
      pagination: { ...DEFAULT_PAGINATION },
    });
    // Automatically fetch with new filters
    get().fetchProducts(1);
  },

  fetchProducts: async (page = 1) => {
    set({ isLoading: true, error: null });

    try {
      const { filters, pagination } = get();
      const result: PaginatedResponse<Product> = await getProducts(
        filters,
        page,
        pagination.limit
      );

      set({
        products: result.items,
        pagination: {
          page,
          limit: pagination.limit,
          hasMore: result.hasMore,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const product = await getProductById(id);

      if (!product) {
        throw new Error('Product not found');
      }

      set({
        selectedProduct: product,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
      });
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),

  resetFilters: () => {
    set({
      filters: DEFAULT_FILTERS,
      pagination: DEFAULT_PAGINATION,
    });
    get().fetchProducts(1);
  },

  clearError: () => set({ error: null }),
}));
