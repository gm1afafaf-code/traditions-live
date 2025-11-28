import { useEffect } from 'react';
import { useProductStore } from '@/stores/productStore';
import type { ProductFilters } from '@/types';

/**
 * Hook for products state and actions
 */
export function useProducts() {
  const {
    products,
    selectedProduct,
    filters,
    pagination,
    isLoading,
    error,
    setFilters,
    fetchProducts,
    fetchProductById,
    clearSelectedProduct,
    resetFilters,
    clearError,
  } = useProductStore();

  return {
    products,
    selectedProduct,
    filters,
    pagination,
    isLoading,
    error,
    setFilters,
    fetchProducts,
    fetchProductById,
    clearSelectedProduct,
    resetFilters,
    clearError,
  };
}

/**
 * Hook to fetch products on mount with optional filters
 */
export function useProductsQuery(initialFilters?: ProductFilters) {
  const { fetchProducts, setFilters, products, isLoading, error } = useProducts();

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    } else {
      fetchProducts(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, isLoading, error };
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string) {
  const { selectedProduct, fetchProductById, clearSelectedProduct, isLoading, error } =
    useProducts();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }

    return () => {
      clearSelectedProduct();
    };
  }, [id, fetchProductById, clearSelectedProduct]);

  return { product: selectedProduct, isLoading, error };
}
