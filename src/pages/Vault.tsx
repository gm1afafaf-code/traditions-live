import { useEffect, useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { useRequireAuth, useRequireApproval, useProducts, useDebounce } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Input, Select, Loading, LuxuryCard, GoldButton, AnimatedCounter } from '@/components/ui';
import { PRODUCT_TYPES, QUALITY_GRADES, SORT_OPTIONS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import type { ProductFilters, Product } from '@/types';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Leaf, 
  Sparkles as SparklesIcon,
  TrendingUp,
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

function Product3DPreview() {
  return (
    <div className="w-full h-48">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#d4af37" />
        <ProductOrb />
        <Sparkles count={50} scale={3} size={2} speed={0.3} color="#d4af37" opacity={0.4} />
      </Canvas>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  onView: (product: Product) => void;
}

function ProductCard({ product, index, onView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LuxuryCard 
        variant="elevated" 
        className="overflow-hidden group cursor-pointer"
        hover
      >
        <div className="relative">
          {isHovered ? (
            <Suspense fallback={
              <div className="w-full h-48 bg-obsidian flex items-center justify-center">
                <Leaf className="w-12 h-12 text-gold/30 animate-pulse" />
              </div>
            }>
              <Product3DPreview />
            </Suspense>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-obsidian to-graphite flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent z-10" />
              <Leaf className="w-16 h-16 text-gold/40 group-hover:text-gold/60 transition-colors" />
              {product.quality && (
                <span className="absolute top-3 right-3 z-20 px-2 py-1 bg-gold/20 text-gold text-xs rounded uppercase tracking-wider">
                  {product.quality}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs text-gold/60 uppercase tracking-wider">{product.type}</span>
              <h3 className="text-lg font-semibold text-white truncate mt-1">{product.name}</h3>
            </div>
          </div>

          <p className="text-sm text-white/50 mb-3 truncate">{product.companyName}</p>

          <div className="flex items-center justify-between border-t border-gold/10 pt-3">
            <div>
              <p className="text-2xl font-light text-gold">{formatCurrency(product.price)}</p>
              <p className="text-xs text-white/40">per {product.unit}</p>
            </div>
            {product.thc && (
              <div className="text-right">
                <p className="text-lg text-gold/80">{product.thc}%</p>
                <p className="text-xs text-white/40">THC</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <GoldButton 
              variant="secondary" 
              size="sm" 
              className="flex-1"
              onClick={() => onView(product)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </GoldButton>
            <GoldButton variant="primary" size="sm" className="flex-1">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </GoldButton>
          </div>
        </div>
      </LuxuryCard>
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
        <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <LuxuryCard variant="elevated" className="p-0 overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-obsidian/80 flex items-center justify-center text-white/60 hover:text-gold transition"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
              <div className="h-48 sm:h-64 md:h-auto bg-gradient-to-br from-obsidian to-graphite">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gold/30 animate-pulse" />
                  </div>
                }>
                  <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[5, 5, 5]} intensity={1} color="#d4af37" />
                    <ProductOrb />
                    <Sparkles count={100} scale={5} size={3} speed={0.3} color="#d4af37" opacity={0.5} />
                  </Canvas>
                </Suspense>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                <span className="text-xs text-gold uppercase tracking-wider">{product.type}</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mt-1 sm:mt-2 mb-2 sm:mb-4">{product.name}</h2>
                
                <p className="text-sm sm:text-base text-white/60 mb-4 sm:mb-6">{product.description || 'Premium quality cannabis product from a verified vendor.'}</p>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 md:p-4 bg-obsidian/50 rounded-lg">
                    <p className="text-xs text-white/40 uppercase mb-1">Price</p>
                    <p className="text-lg sm:text-xl md:text-2xl text-gold">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-white/40">per {product.unit}</p>
                  </div>
                  {product.thc && (
                    <div className="p-2 sm:p-3 md:p-4 bg-obsidian/50 rounded-lg">
                      <p className="text-xs text-white/40 uppercase mb-1">THC Content</p>
                      <p className="text-lg sm:text-xl md:text-2xl text-gold">{product.thc}%</p>
                    </div>
                  )}
                  <div className="p-2 sm:p-3 md:p-4 bg-obsidian/50 rounded-lg">
                    <p className="text-xs text-white/40 uppercase mb-1">Available Stock</p>
                    <p className="text-lg sm:text-xl md:text-2xl text-gold">{product.stock}</p>
                    <p className="text-xs text-white/40">{product.unit}s</p>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-obsidian/50 rounded-lg">
                    <p className="text-xs text-white/40 uppercase mb-1">Quality</p>
                    <p className="text-base sm:text-lg md:text-xl text-gold">{product.quality || 'Standard'}</p>
                  </div>
                </div>

                <div className="border-t border-gold/10 pt-4 sm:pt-6 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-white/40 mb-1 sm:mb-2">Vendor</p>
                  <p className="text-sm sm:text-base text-white font-medium">{product.companyName}</p>
                  <p className="text-xs text-white/40">License: {product.licenseNumber}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <GoldButton variant="primary" size="md" className="flex-1">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Add to Cart
                  </GoldButton>
                  <GoldButton variant="secondary" size="md" className="flex-1 sm:flex-none">
                    View COA
                  </GoldButton>
                </div>
              </div>
            </div>
          </LuxuryCard>
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
      <div className="min-h-screen luxury-bg">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-void/80 backdrop-blur-xl border-b border-gold/10">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h1 className="serif text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-wide">
                  <span className="text-gold">Live</span> Marketplace
                </h1>
                <p className="text-white/50 text-xs sm:text-sm mt-1">Real-time inventory from verified vendors</p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gold">
                    <Package className="w-4 h-4" />
                    <AnimatedCounter value={products.length} suffix=" SKUs" />
                  </div>
                  <div className="flex items-center gap-2 text-gold/70">
                    <TrendingUp className="w-4 h-4" />
                    <span>Live Sync</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 border-l border-gold/20 pl-3 sm:pl-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded ${viewMode === 'grid' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white'}`}
                  >
                    <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded ${viewMode === 'list' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white'}`}
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                <Input
                  placeholder="Search strains, vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 bg-obsidian/50 border-gold/20 text-white placeholder:text-white/30 focus:border-gold text-sm sm:text-base"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition text-sm ${
                    showFilters ? 'bg-gold/20 border-gold text-gold' : 'border-gold/20 text-white/60 hover:border-gold/40'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className={`w-4 h-4 transition ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <GoldButton variant="primary" size="sm" className="flex-1 sm:flex-none">
                  <Zap className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">AI Match</span>
                </GoldButton>
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <Select
                      options={[
                        { value: '', label: 'All Types' },
                        ...PRODUCT_TYPES.map((type) => ({ value: type, label: type })),
                      ]}
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="bg-obsidian/50 border-gold/20 text-white"
                    />

                    <Select
                      options={[
                        { value: '', label: 'All Quality' },
                        ...QUALITY_GRADES.map((grade) => ({ value: grade, label: grade })),
                      ]}
                      value={filters.quality || ''}
                      onChange={(e) => handleFilterChange('quality', e.target.value)}
                      className="bg-obsidian/50 border-gold/20 text-white"
                    />

                    <Select
                      options={SORT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                      value={filters.sortBy || 'newest'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="bg-obsidian/50 border-gold/20 text-white"
                    />

                    <Input
                      type="number"
                      placeholder="Min THC %"
                      value={filters.minTHC || ''}
                      onChange={(e) => handleFilterChange('minTHC', e.target.value)}
                      className="bg-obsidian/50 border-gold/20 text-white placeholder:text-white/30"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loading size="lg" text="Loading inventory..." />
            </div>
          ) : error ? (
            <LuxuryCard variant="glass" className="text-center py-20">
              <SparklesIcon className="w-16 h-16 text-red-400/50 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">Failed to Load Products</h3>
              <p className="text-white/50 mb-4">There was an error loading the inventory.</p>
              <p className="text-red-400/80 text-sm mb-6 max-w-lg mx-auto break-words font-mono bg-obsidian/50 p-3 rounded">{error}</p>
              <GoldButton variant="secondary" onClick={() => fetchProducts(1)}>
                Try Again
              </GoldButton>
            </LuxuryCard>
          ) : products.length === 0 ? (
            <LuxuryCard variant="glass" className="text-center py-20">
              <SparklesIcon className="w-16 h-16 text-gold/30 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">No Products Found</h3>
              <p className="text-white/50 mb-6">Try adjusting your filters or search terms</p>
              <GoldButton variant="secondary" onClick={() => setFilters({})}>
                Clear Filters
              </GoldButton>
            </LuxuryCard>
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
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
              <div className="flex justify-center mt-12">
                <GoldButton variant="secondary" size="lg" onClick={handleLoadMore}>
                  Load More Products
                </GoldButton>
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
