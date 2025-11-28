import { useEffect, useState } from 'react';
import { useRequireAuth, useRequireApproval, useProducts, useDebounce } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Input, Select, Loading } from '@/components/ui';
import { PRODUCT_TYPES, QUALITY_GRADES, SORT_OPTIONS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import type { ProductFilters } from '@/types';

export function Vault() {
  useRequireAuth();
  useRequireApproval();

  const { products, filters, isLoading, setFilters, fetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    setFilters({ [key]: value || undefined });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="serif text-4xl font-semibold text-charcoal tracking-[0.08em] border-l-4 border-gold pl-4">
            VAULT
          </h1>
          <p className="text-slate text-sm mt-1 ml-4">Browse verified wholesale inventory</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px]"
          />

          <Select
            options={[
              { value: '', label: 'All Types' },
              ...PRODUCT_TYPES.map((type) => ({ value: type, label: type })),
            ]}
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          />

          <Select
            options={[
              { value: '', label: 'All Quality' },
              ...QUALITY_GRADES.map((grade) => ({ value: grade, label: grade })),
            ]}
            value={filters.quality || ''}
            onChange={(e) => handleFilterChange('quality', e.target.value)}
          />

          <Select
            options={SORT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
            value={filters.sortBy || 'newest'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" text="Loading products..." />
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-20" padding="lg">
            <p className="text-slate text-lg">No products found</p>
            <p className="text-slate/70 text-sm mt-2">Try adjusting your filters</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="product-card cursor-pointer hover:shadow-lg transition-all"
                padding="none"
              >
                <div className="aspect-square bg-marble-dark flex items-center justify-center">
                  <span className="text-4xl text-gold">🌱</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-charcoal text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-slate mb-2">{product.companyName}</p>

                  <div className="flex items-baseline justify-between">
                    <span className="text-gold font-semibold">{formatCurrency(product.price)}</span>
                    <span className="text-xs text-slate">/{product.unit}</span>
                  </div>

                  {product.thc && (
                    <div className="mt-2 pt-2 border-t border-black/5">
                      <span className="text-xs text-slate">THC: {product.thc}%</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
