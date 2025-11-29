import { useEffect, useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { useRequireAuth, useRequireApproval, useProducts, useDebounce } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Input, Select, Loading } from '@/components/ui';
import { PRODUCT_TYPES, QUALITY_GRADES, SORT_OPTIONS } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import type { ProductFilters, Product } from '@/types';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Leaf, 
  Sparkles as SparklesIcon,
  Package,
  ChevronDown,
  X,
  Zap,
  Eye,
  ShoppingCart
} from 'lucide-react';

function ProductOrb() {
  return (
    <Float speed={3} rotationIntensity={0.8} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <MeshDistortMaterial
          color="#2d5a27"
          metalness={0.3}
          roughness={0.6}
          distort={0.2}
          speed={2}
        />
      </mesh>
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#d4af37" distance={5} />
    </Float>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  onView: (product: Product) => void;
}

function ProductCard({ product, index, onView }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={() => onView(product)}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all duration-300">
        {/* Product Image/Icon Area */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent z-10" />
          <Leaf className="w-14 h-14 sm:w-16 sm:h-16 text-amber-500/40 group-hover:text-amber-500/60 transition-colors group-hover:scale-110 duration-300" />
          
          {/* Quality Badge */}
          {product.quality && (
            <span className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full uppercase tracking-wider shadow-sm">
              {product.quality}
            </span>
          )}
          
          {/* Live indicator */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-stone-600">Live</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <span className="text-xs text-amber-600 uppercase tracking-wider font-medium">{product.type}</span>
            <h3 className="text-base sm:text-lg font-semibold text-stone-900 truncate mt-0.5">{product.name}</h3>
            <p className="text-sm text-stone-500 truncate">{product.companyName}</p>
          </div>

          <div className="flex items-end justify-between border-t border-stone-100 pt-3">
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-stone-900">{formatCurrency(product.price)}</p>
              <p className="text-xs text-stone-400">per {product.unit}</p>
            </div>
            {product.thc && (
              <div className="text-right bg-amber-50 px-3 py-1.5 rounded-lg">
                <p className="text-lg font-semibold text-amber-700">{product.thc}%</p>
                <p className="text-xs text-amber-600">THC</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onView(product); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              <span>Details</span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition text-sm font-medium shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
            {/* 3D Preview - Only show on desktop */}
            <div className="h-48 sm:h-64 md:h-auto md:min-h-[400px] bg-gradient-to-br from-stone-100 to-stone-50 hidden md:block">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="w-16 h-16 md:w-20 md:h-20 text-amber-500/30 animate-pulse" />
                </div>
              }>
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[5, 5, 5]} intensity={1} color="#d4af37" />
                  <ProductOrb />
                  <Sparkles count={100} scale={5} size={3} speed={0.3} color="#d4af37" opacity={0.5} />
                </Canvas>
              </Suspense>
            </div>

            {/* Mobile: Static image placeholder */}
            <div className="h-40 sm:h-48 bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center md:hidden">
              <Leaf className="w-16 h-16 text-amber-500/40" />
              {product.quality && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full uppercase tracking-wider">
                  {product.quality}
                </span>
              )}
            </div>

            <div className="p-5 sm:p-6 md:p-8">
              <span className="text-xs text-amber-600 uppercase tracking-wider font-medium">{product.type}</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-900 mt-1 mb-3">{product.name}</h2>
              
              <p className="text-sm sm:text-base text-stone-500 mb-5">{product.description || 'Premium quality cannabis product from a verified vendor.'}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 sm:p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-xs text-stone-400 uppercase mb-1">Price</p>
                  <p className="text-xl sm:text-2xl font-semibold text-stone-900">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-stone-400">per {product.unit}</p>
                </div>
                {product.thc && (
                  <div className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 uppercase mb-1">THC Content</p>
                    <p className="text-xl sm:text-2xl font-semibold text-amber-700">{product.thc}%</p>
                  </div>
                )}
                <div className="p-3 sm:p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-xs text-stone-400 uppercase mb-1">Available Stock</p>
                  <p className="text-xl sm:text-2xl font-semibold text-stone-900">{product.stock}</p>
                  <p className="text-xs text-stone-400">{product.unit}s</p>
                </div>
                <div className="p-3 sm:p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-xs text-stone-400 uppercase mb-1">Quality</p>
                  <p className="text-lg sm:text-xl font-semibold text-stone-900">{product.quality || 'Standard'}</p>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-5 mb-5">
                <p className="text-xs text-stone-400 uppercase mb-2">Vendor</p>
                <p className="text-base text-stone-900 font-medium">{product.companyName}</p>
                <p className="text-sm text-stone-400">License: {product.licenseNumber}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition font-medium shadow-sm">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition font-medium">
                  View COA
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Vault() {
  useRequireAuth();
  useRequireApproval();

  const { products, filters, isLoading, error, setFilters, fetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  const handleFilterChange = useCallback((key: keyof ProductFilters, value: string) => {
    setFilters({ [key]: value || undefined });
  }, [setFilters]);

  const handleLoadMore = useCallback(() => {
    fetchProducts((filters as { page?: number }).page ? (filters as { page?: number }).page! + 1 : 2);
  }, [fetchProducts, filters]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-stone-50">
        {/* Header - top-16 on mobile to account for AppLayout mobile header */}
        <div className="sticky top-16 md:top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-wide">
                  <span className="text-amber-600">Live</span> Marketplace
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-stone-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Real-time inventory
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
                    <Package className="w-3.5 h-3.5" />
                    {products.length} SKUs
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-md transition',
                      viewMode === 'grid' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-md transition',
                      viewMode === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  placeholder="Search strains, vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl border transition text-sm font-medium',
                    showFilters 
                      ? 'bg-amber-50 border-amber-200 text-amber-700' 
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className={cn('w-4 h-4 transition', showFilters && 'rotate-180')} />
                </button>

                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition text-sm font-medium shadow-sm">
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Match</span>
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                    <Select
                      options={[
                        { value: '', label: 'All Types' },
                        ...PRODUCT_TYPES.map((type) => ({ value: type, label: type })),
                      ]}
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="bg-white border-stone-200 text-stone-900"
                    />

                    <Select
                      options={[
                        { value: '', label: 'All Quality' },
                        ...QUALITY_GRADES.map((grade) => ({ value: grade, label: grade })),
                      ]}
                      value={filters.quality || ''}
                      onChange={(e) => handleFilterChange('quality', e.target.value)}
                      className="bg-white border-stone-200 text-stone-900"
                    />

                    <Select
                      options={SORT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                      value={filters.sortBy || 'newest'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="bg-white border-stone-200 text-stone-900"
                    />

                    <Input
                      type="number"
                      placeholder="Min THC %"
                      value={filters.minTHC || ''}
                      onChange={(e) => handleFilterChange('minTHC', e.target.value)}
                      className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loading size="lg" text="Loading inventory..." />
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 text-center py-16 px-6">
              <SparklesIcon className="w-14 h-14 text-red-400/60 mx-auto mb-5" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Failed to Load Products</h3>
              <p className="text-stone-500 mb-4">There was an error loading the inventory.</p>
              <p className="text-red-500 text-sm mb-6 max-w-lg mx-auto break-words font-mono bg-red-50 p-3 rounded-lg">{error}</p>
              <button 
                onClick={() => fetchProducts(1)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition font-medium"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 text-center py-16 px-6">
              <SparklesIcon className="w-14 h-14 text-amber-400/60 mx-auto mb-5" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">No Products Found</h3>
              <p className="text-stone-500 mb-6">Try adjusting your filters or search terms</p>
              <button 
                onClick={() => setFilters({})}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={cn(
                'grid gap-4 sm:gap-5',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              )}>
                {products.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onView={setSelectedProduct}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-10">
                <button 
                  onClick={handleLoadMore}
                  className="px-6 py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition font-medium"
                >
                  Load More Products
                </button>
              </div>
            </>
          )}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </AppLayout>
  );
}
