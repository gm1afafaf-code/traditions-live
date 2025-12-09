import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Truck, Shield, Leaf, Star, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

// Sample product data (would come from API in production)
const featuredProducts = [
  {
    id: '1',
    name: 'Premium THCA Flower',
    strain: 'Exotic Indoor',
    price: 39.99,
    originalPrice: 59.99,
    thc: '28.5%',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 342,
  },
  {
    id: '2',
    name: 'THCA Smalls',
    strain: 'Mixed Exotic',
    price: 24.99,
    originalPrice: 34.99,
    thc: '25.2%',
    image: 'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=400&h=400&fit=crop',
    badge: 'Sale',
    rating: 4.8,
    reviews: 189,
  },
  {
    id: '3',
    name: 'Live Resin Cartridge',
    strain: 'Sativa Blend',
    price: 44.99,
    originalPrice: null,
    thc: '92%',
    image: 'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=400&h=400&fit=crop',
    badge: 'New',
    rating: 4.7,
    reviews: 98,
  },
  {
    id: '4',
    name: 'THC Gummies',
    strain: '25mg Each',
    price: 29.99,
    originalPrice: null,
    thc: '250mg',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    badge: null,
    rating: 4.9,
    reviews: 456,
  },
];

const categories = [
  {
    name: 'THCA Flower',
    description: 'Premium indoor & exotic strains',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=600&h=400&fit=crop',
    href: '/shop/flower',
  },
  {
    name: 'Vapes & Carts',
    description: 'Live resin & distillate',
    image: 'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=600&h=400&fit=crop',
    href: '/shop/vapes',
  },
  {
    name: 'Edibles',
    description: 'Gummies, chocolates & more',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=400&fit=crop',
    href: '/shop/edibles',
  },
  {
    name: 'Concentrates',
    description: 'Dabs, wax & extracts',
    image: 'https://images.unsplash.com/photo-1585821569331-f071db2abd8d?w=600&h=400&fit=crop',
    href: '/shop/concentrates',
  },
];

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen bg-dark">
      {/* Announcement Bar */}
      <div className="bg-emerald-600 text-white text-center py-2 px-4 text-sm font-medium">
        <span className="hidden sm:inline">🔥 FREE SHIPPING on orders over $77 | </span>
        <span>Use code <span className="font-bold">VOUCHED20</span> for 20% off your first order!</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-display tracking-wider text-white">VOUCHED</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/shop" className="text-gray-300 hover:text-emerald-400 transition font-medium">
                Shop All
              </Link>
              <Link to="/shop/flower" className="text-gray-300 hover:text-emerald-400 transition font-medium">
                THCA Flower
              </Link>
              <Link to="/shop/vapes" className="text-gray-300 hover:text-emerald-400 transition font-medium">
                Vapes
              </Link>
              <Link to="/shop/edibles" className="text-gray-300 hover:text-emerald-400 transition font-medium">
                Edibles
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-emerald-400 transition font-medium">
                About
              </Link>
            </nav>

            {/* Right Actions */}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-50 border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <Link to="/shop" className="block py-2 text-gray-300 hover:text-emerald-400 transition">
                Shop All
              </Link>
              <Link to="/shop/flower" className="block py-2 text-gray-300 hover:text-emerald-400 transition">
                THCA Flower
              </Link>
              <Link to="/shop/vapes" className="block py-2 text-gray-300 hover:text-emerald-400 transition">
                Vapes
              </Link>
              <Link to="/shop/edibles" className="block py-2 text-gray-300 hover:text-emerald-400 transition">
                Edibles
              </Link>
              <Link to="/about" className="block py-2 text-gray-300 hover:text-emerald-400 transition">
                About
              </Link>
              <Link to={ROUTES.LOGIN} className="block py-2 text-emerald-400 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-dark to-dark" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Premium THCA • Lab Tested • Ships Nationwide
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-wide text-white mb-6">
              PREMIUM CANNABIS
              <span className="block text-emerald-400">DELIVERED TO YOU</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg">
              Shop the finest THCA flower, vapes, and edibles. Lab-tested, federally legal, and delivered discreetly to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105"
              >
                Shop Now
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/shop/flower"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
              >
                Browse Flower
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-dark-50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="font-semibold text-white">Free Shipping</p>
                <p className="text-sm text-gray-500">Orders over $77</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="font-semibold text-white">Lab Tested</p>
                <p className="text-sm text-gray-500">COA Available</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="font-semibold text-white">100% Legal</p>
                <p className="text-sm text-gray-500">2018 Farm Bill</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="font-semibold text-white">4.9 Rating</p>
                <p className="text-sm text-gray-500">2,000+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display tracking-wide text-white mb-4">
              SHOP BY CATEGORY
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our curated selection of premium cannabis products
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-display tracking-wide text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display tracking-wide text-white mb-2">
                BEST SELLERS
              </h2>
              <p className="text-gray-400">Our most popular products</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-dark rounded-xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition"
              >
                <div className="relative aspect-square overflow-hidden">
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
                          : 'bg-yellow-500 text-black'
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
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
                </div>
              </Link>
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              View All Products
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-20" />

            <div className="relative px-8 py-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-5xl font-display tracking-wide text-white mb-4">
                GET 20% OFF YOUR FIRST ORDER
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join the Vouched family and experience premium cannabis products delivered straight to your door.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105"
              >
                Shop Now & Save
                <ChevronRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-white/60 mt-4">Use code VOUCHED20 at checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display tracking-wide text-white mb-6">
                WHY CHOOSE VOUCHED?
              </h2>
              <p className="text-gray-400 mb-6">
                We partner with the top growers in the world to deliver premium, lab-tested products nationwide. Every product comes with a Certificate of Analysis (COA) so you know exactly what you're getting.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Premium Quality</p>
                    <p className="text-sm text-gray-400">Sourced from top cultivators nationwide</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Lab Tested</p>
                    <p className="text-sm text-gray-400">Third-party tested for potency & purity</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Discreet Shipping</p>
                    <p className="text-sm text-gray-400">Plain packaging, no labels</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Fast Delivery</p>
                    <p className="text-sm text-gray-400">Ships within 24-48 hours</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=600&h=600&fit=crop"
                alt="Premium Cannabis"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-500 text-white p-6 rounded-xl shadow-xl">
                <p className="text-4xl font-display">4.9★</p>
                <p className="text-sm">2,000+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-100 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Leaf className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-display tracking-wider text-white">VOUCHED</span>
              </Link>
              <p className="text-gray-400 text-sm mb-4">
                Premium THCA flower and cannabis products delivered nationwide.
              </p>
              <p className="text-gray-500 text-xs">
                Must be 21+ to purchase. Products contain less than 0.3% Δ9-THC.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop/flower" className="text-gray-400 hover:text-emerald-400 transition">THCA Flower</Link></li>
                <li><Link to="/shop/vapes" className="text-gray-400 hover:text-emerald-400 transition">Vapes & Carts</Link></li>
                <li><Link to="/shop/edibles" className="text-gray-400 hover:text-emerald-400 transition">Edibles</Link></li>
                <li><Link to="/shop/concentrates" className="text-gray-400 hover:text-emerald-400 transition">Concentrates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-400 hover:text-emerald-400 transition">About Us</Link></li>
                <li><Link to="/reviews" className="text-gray-400 hover:text-emerald-400 transition">Reviews</Link></li>
                <li><Link to="/lab-results" className="text-gray-400 hover:text-emerald-400 transition">Lab Results</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-emerald-400 transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/faq" className="text-gray-400 hover:text-emerald-400 transition">FAQ</Link></li>
                <li><Link to="/shipping" className="text-gray-400 hover:text-emerald-400 transition">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-gray-400 hover:text-emerald-400 transition">Returns</Link></li>
                <li><Link to="/track" className="text-gray-400 hover:text-emerald-400 transition">Track Order</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Vouched. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
