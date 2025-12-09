import { Link, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  Leaf,
  Star,
  Filter,
  ChevronDown,
  Grid3X3,
  List,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

// Product data
const allProducts = [
  {
    id: '1',
    name: 'Premium THCA Flower',
    strain: 'Exotic Indoor',
    category: 'flower',
    price: 39.99,
    originalPrice: 59.99,
    thc: '28.5%',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 342,
    strainType: 'hybrid',
  },
  {
    id: '2',
    name: 'THCA Smalls',
    strain: 'Mixed Exotic',
    category: 'flower',
    price: 24.99,
    originalPrice: 34.99,
    thc: '25.2%',
    image: 'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=400&h=400&fit=crop',
    badge: 'Sale',
    rating: 4.8,
    reviews: 189,
    strainType: 'hybrid',
  },
  {
    id: '3',
    name: 'Live Resin Cartridge',
    strain: 'Sativa Blend',
    category: 'vapes',
    price: 44.99,
    originalPrice: null,
    thc: '92%',
    image: 'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=400&h=400&fit=crop',
    badge: 'New',
    rating: 4.7,
    reviews: 98,
    strainType: 'sativa',
  },
  {
    id: '4',
    name: 'THC Gummies',
    strain: '25mg Each',
    category: 'edibles',
    price: 29.99,
    originalPrice: null,
    thc: '250mg',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    badge: null,
    rating: 4.9,
    reviews: 456,
    strainType: null,
  },
  {
    id: '5',
    name: 'Greenhouse THCA Flower',
    strain: 'OG Kush',
    category: 'flower',
    price: 29.99,
    originalPrice: null,
    thc: '24.1%',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
    badge: null,
    rating: 4.6,
    reviews: 234,
    strainType: 'indica',
  },
  {
    id: '6',
    name: 'THCA Disposable Vape',
    strain: 'Blue Dream',
    category: 'vapes',
    price: 34.99,
    originalPrice: 44.99,
    thc: '88%',
    image: 'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=400&h=400&fit=crop',
    badge: 'Sale',
    rating: 4.8,
    reviews: 156,
    strainType: 'sativa',
  },
  {
    id: '7',
    name: 'THC Chocolate Bar',
    strain: '100mg Total',
    category: 'edibles',
    price: 24.99,
    originalPrice: null,
    thc: '100mg',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    badge: null,
    rating: 4.7,
    reviews: 89,
    strainType: null,
  },
  {
    id: '8',
    name: 'Live Rosin Concentrate',
    strain: 'Gelato',
    category: 'concentrates',
    price: 54.99,
    originalPrice: null,
    thc: '78%',
    image: 'https://images.unsplash.com/photo-1585821569331-f071db2abd8d?w=400&h=400&fit=crop',
    badge: 'Premium',
    rating: 4.9,
    reviews: 67,
    strainType: 'hybrid',
  },
  {
    id: '9',
    name: 'THCA Diamonds',
    strain: 'Wedding Cake',
    category: 'concentrates',
    price: 64.99,
    originalPrice: 79.99,
    thc: '95%',
    image: 'https://images.unsplash.com/photo-1585821569331-f071db2abd8d?w=400&h=400&fit=crop',
    badge: 'Sale',
    rating: 4.9,
    reviews: 45,
    strainType: 'hybrid',
  },
  {
    id: '10',
    name: 'Indoor Exotic THCA',
    strain: 'Runtz',
    category: 'flower',
    price: 49.99,
    originalPrice: null,
    thc: '32.1%',
    image: 'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=400&h=400&fit=crop',
    badge: 'Top Shelf',
    rating: 5.0,
    reviews: 178,
    strainType: 'hybrid',
  },
  {
    id: '11',
    name: 'THCA Pre-Rolls',
    strain: '5-Pack',
    category: 'flower',
    price: 19.99,
    originalPrice: 24.99,
    thc: '26%',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
    badge: 'Sale',
    rating: 4.7,
    reviews: 312,
    strainType: 'sativa',
  },
  {
    id: '12',
    name: 'Delta-8 Gummies',
    strain: '50mg Each',
    category: 'edibles',
    price: 34.99,
    originalPrice: null,
    thc: '500mg',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    badge: 'Strong',
    rating: 4.8,
    reviews: 267,
    strainType: null,
  },
];

const categoryInfo: Record<string, { title: string; description: string }> = {
  flower: {
    title: 'THCA Flower',
    description: 'Premium indoor & exotic strains with high THCA content',
  },
  vapes: {
    title: 'Vapes & Cartridges',
    description: 'Live resin & distillate vapes for smooth hits',
  },
  edibles: {
    title: 'Edibles',
    description: 'Gummies, chocolates & more infused treats',
  },
  concentrates: {
    title: 'Concentrates',
    description: 'Dabs, wax, diamonds & premium extracts',
  },
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export function Shop() {
  const { category } = useParams<{ category?: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [strainFilter, setStrainFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartCount] = useState(0);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category
    if (category) {
      products = products.filter((p) => p.category === category);
    }

    // Filter by strain type
    if (strainFilter) {
      products = products.filter((p) => p.strainType === strainFilter);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.reverse();
        break;
    }

    return products;
  }, [category, sortBy, strainFilter]);

  const currentCategory = category ? categoryInfo[category] : null;

  return (
    <div className="min-h-screen bg-dark">
      {/* Announcement Bar */}
      <div className="bg-emerald-600 text-white text-center py-2 px-4 text-sm font-medium">
        <span className="hidden sm:inline">🔥 FREE SHIPPING on orders over $77 | </span>
        <span>
          Use code <span className="font-bold">VOUCHED20</span> for 20% off!
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-display tracking-wider text-white">VOUCHED</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/shop" className="text-emerald-400 font-medium">
                Shop All
              </Link>
              <Link
                to="/shop/flower"
                className={`transition font-medium ${
                  category === 'flower' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                THCA Flower
              </Link>
              <Link
                to="/shop/vapes"
                className={`transition font-medium ${
                  category === 'vapes' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                Vapes
              </Link>
              <Link
                to="/shop/edibles"
                className={`transition font-medium ${
                  category === 'edibles' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                Edibles
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.LOGIN}
                className="hidden sm:block text-gray-300 hover:text-white transition font-medium"
              >
                Sign In
              </Link>
              <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-50 border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <Link to="/shop" className="block py-2 text-emerald-400">
                Shop All
              </Link>
              <Link to="/shop/flower" className="block py-2 text-gray-300 hover:text-emerald-400">
                THCA Flower
              </Link>
              <Link to="/shop/vapes" className="block py-2 text-gray-300 hover:text-emerald-400">
                Vapes
              </Link>
              <Link to="/shop/edibles" className="block py-2 text-gray-300 hover:text-emerald-400">
                Edibles
              </Link>
              <Link to={ROUTES.LOGIN} className="block py-2 text-emerald-400 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Header */}
      <div className="bg-dark-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-white transition">
              Shop
            </Link>
            {currentCategory && (
              <>
                <span>/</span>
                <span className="text-white">{currentCategory.title}</span>
              </>
            )}
          </nav>
          <h1 className="text-3xl md:text-4xl font-display tracking-wide text-white">
            {currentCategory ? currentCategory.title : 'ALL PRODUCTS'}
          </h1>
          {currentCategory && <p className="text-gray-400 mt-2">{currentCategory.description}</p>}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/shop"
                      className={`block py-2 px-3 rounded-lg transition ${
                        !category
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      All Products
                    </Link>
                  </li>
                  {Object.entries(categoryInfo).map(([key, info]) => (
                    <li key={key}>
                      <Link
                        to={`/shop/${key}`}
                        className={`block py-2 px-3 rounded-lg transition ${
                          category === key
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {info.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strain Type Filter */}
              {(category === 'flower' || category === 'vapes' || !category) && (
                <div>
                  <h3 className="font-semibold text-white mb-4">Strain Type</h3>
                  <div className="space-y-2">
                    {['indica', 'sativa', 'hybrid'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setStrainFilter(strainFilter === type ? null : type)}
                        className={`block w-full text-left py-2 px-3 rounded-lg transition capitalize ${
                          strainFilter === type
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-gray-400">
                Showing <span className="text-white font-medium">{filteredProducts.length}</span>{' '}
                products
              </p>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-dark-50 rounded-lg text-gray-300 hover:text-white transition"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-dark-50 border border-white/10 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition ${
                      viewMode === 'grid'
                        ? 'bg-emerald-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition ${
                      viewMode === 'list'
                        ? 'bg-emerald-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`group bg-dark-50 rounded-xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : 'aspect-square'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                          product.badge === 'Sale'
                            ? 'bg-red-500 text-white'
                            : product.badge === 'New'
                            ? 'bg-emerald-500 text-white'
                            : product.badge === 'Top Shelf' || product.badge === 'Premium'
                            ? 'bg-purple-500 text-white'
                            : product.badge === 'Strong'
                            ? 'bg-orange-500 text-white'
                            : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <p className="text-sm text-emerald-400 mb-1">{product.strain}</p>
                    <h3 className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-400">{product.rating}</span>
                      </div>
                      <span className="text-gray-600">•</span>
                      <span className="text-sm text-gray-400">{product.reviews} reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">THC: {product.thc}</p>
                    {viewMode === 'list' && (
                      <button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition">
                        Add to Cart
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No products found</p>
                <Link
                  to="/shop"
                  className="inline-block mt-4 text-emerald-400 hover:text-emerald-300 transition"
                >
                  View all products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-dark rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                <Link
                  to="/shop"
                  onClick={() => setFiltersOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    !category
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All Products
                </Link>
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <Link
                    key={key}
                    to={`/shop/${key}`}
                    onClick={() => setFiltersOpen(false)}
                    className={`block py-2 px-3 rounded-lg transition ${
                      category === key
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {info.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Strain Type */}
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-4">Strain Type</h3>
              <div className="flex flex-wrap gap-2">
                {['indica', 'sativa', 'hybrid'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setStrainFilter(strainFilter === type ? null : type)}
                    className={`py-2 px-4 rounded-full transition capitalize ${
                      strainFilter === type
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-50 text-gray-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-dark-100 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-display tracking-wider text-white">VOUCHED</span>
            </Link>
            <p className="text-gray-500 text-sm">© 2025 Vouched. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
