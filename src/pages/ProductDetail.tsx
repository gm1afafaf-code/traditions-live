import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  ShoppingCart,
  Leaf,
  Star,
  Truck,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

// Sample product data - in production this would come from an API
const products: Record<string, {
  id: string;
  name: string;
  strain: string;
  category: string;
  price: number;
  originalPrice: number | null;
  thc: string;
  images: string[];
  badge: string | null;
  rating: number;
  reviews: number;
  strainType: string | null;
  description: string;
  effects: string[];
  flavors: string[];
  sizes: { label: string; price: number }[];
}> = {
  '1': {
    id: '1',
    name: 'Premium THCA Flower',
    strain: 'Exotic Indoor',
    category: 'flower',
    price: 39.99,
    originalPrice: 59.99,
    thc: '28.5%',
    images: [
      'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=800&h=800&fit=crop',
    ],
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 342,
    strainType: 'hybrid',
    description:
      'Our Premium THCA Flower is grown in state-of-the-art indoor facilities using organic practices. Each batch is carefully cured and hand-trimmed to ensure the highest quality. Lab-tested for potency and purity, this exotic strain delivers a smooth, flavorful experience with powerful effects.',
    effects: ['Relaxed', 'Happy', 'Euphoric', 'Creative'],
    flavors: ['Earthy', 'Pine', 'Citrus'],
    sizes: [
      { label: '3.5g (Eighth)', price: 39.99 },
      { label: '7g (Quarter)', price: 74.99 },
      { label: '14g (Half)', price: 139.99 },
      { label: '28g (Ounce)', price: 259.99 },
    ],
  },
  '2': {
    id: '2',
    name: 'THCA Smalls',
    strain: 'Mixed Exotic',
    category: 'flower',
    price: 24.99,
    originalPrice: 34.99,
    thc: '25.2%',
    images: [
      'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=800&h=800&fit=crop',
    ],
    badge: 'Sale',
    rating: 4.8,
    reviews: 189,
    strainType: 'hybrid',
    description:
      'Same premium quality as our regular flower, just in smaller buds. Perfect for those who want top-shelf quality at a budget-friendly price. Our THCA Smalls are sourced from the same batches as our premium flower.',
    effects: ['Relaxed', 'Calm', 'Sleepy'],
    flavors: ['Sweet', 'Berry', 'Diesel'],
    sizes: [
      { label: '7g (Quarter)', price: 24.99 },
      { label: '14g (Half)', price: 44.99 },
      { label: '28g (Ounce)', price: 79.99 },
    ],
  },
  '3': {
    id: '3',
    name: 'Live Resin Cartridge',
    strain: 'Sativa Blend',
    category: 'vapes',
    price: 44.99,
    originalPrice: null,
    thc: '92%',
    images: [
      'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=800&h=800&fit=crop',
    ],
    badge: 'New',
    rating: 4.7,
    reviews: 98,
    strainType: 'sativa',
    description:
      'Experience the full spectrum of cannabinoids and terpenes with our Live Resin Cartridge. Made from fresh-frozen flower to preserve the natural terpene profile. Compatible with all standard 510-thread batteries.',
    effects: ['Energetic', 'Focused', 'Creative', 'Uplifted'],
    flavors: ['Citrus', 'Tropical', 'Herbal'],
    sizes: [
      { label: '0.5g Cart', price: 29.99 },
      { label: '1g Cart', price: 44.99 },
    ],
  },
  '4': {
    id: '4',
    name: 'THC Gummies',
    strain: '25mg Each',
    category: 'edibles',
    price: 29.99,
    originalPrice: null,
    thc: '250mg',
    images: [
      'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&h=800&fit=crop',
    ],
    badge: null,
    rating: 4.9,
    reviews: 456,
    strainType: null,
    description:
      'Delicious fruit-flavored gummies infused with premium THC distillate. Each gummy contains exactly 25mg of THC for precise dosing. Perfect for both beginners and experienced users.',
    effects: ['Relaxed', 'Happy', 'Sleepy', 'Hungry'],
    flavors: ['Mixed Fruit', 'Strawberry', 'Watermelon', 'Blue Raspberry'],
    sizes: [
      { label: '10 Pack (250mg)', price: 29.99 },
      { label: '20 Pack (500mg)', price: 54.99 },
      { label: '40 Pack (1000mg)', price: 99.99 },
    ],
  },
};

// Default product for IDs not found
const defaultProduct = products['1'];

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id && products[id] ? products[id] : defaultProduct;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

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
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-dark-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-white transition">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/shop/${product.category}`} className="hover:text-white transition capitalize">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-dark-50 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-emerald-500'
                        : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.badge && (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
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

            <h1 className="text-3xl md:text-4xl font-display tracking-wide text-white mb-2">
              {product.name}
            </h1>
            <p className="text-emerald-400 mb-4">{product.strain}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-white font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-400">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-white">
                ${product.sizes[selectedSize].price}
              </span>
              {product.originalPrice && selectedSize === 0 && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* THC Content */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-500/10 rounded-lg inline-flex">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">THC: {product.thc}</span>
              {product.strainType && (
                <>
                  <span className="text-gray-500">|</span>
                  <span className="text-emerald-400 capitalize">{product.strainType}</span>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Size</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(index)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedSize === index
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : 'border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/10 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-white transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-400 hover:text-white transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart - ${(product.sizes[selectedSize].price * quantity).toFixed(2)}
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-400">
                <Truck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Free shipping over $77</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Lab tested & certified</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Effects & Flavors */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-white font-medium mb-3">Effects</h3>
                <div className="flex flex-wrap gap-2">
                  {product.effects.map((effect) => (
                    <span
                      key={effect}
                      className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium mb-3">Flavors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((flavor) => (
                    <span
                      key={flavor}
                      className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
