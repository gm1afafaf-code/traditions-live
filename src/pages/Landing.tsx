import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, User, Star, Truck, Shield, Leaf } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

// Sample product data
const topSellers = [
  {
    id: '1',
    name: 'THCa Greenhouse Smalls',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'THCa Exotic Smalls',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Snowballs Smalls THCa Flower',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    name: 'THCa Super Exotic Smalls',
    price: 33.00,
    image: 'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    name: 'THCa Mini Prerolls .5g 7 Count',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    name: 'Snowballs THCa Flower',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=400&h=400&fit=crop',
  },
  {
    id: '7',
    name: 'Baysentials Bundle',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop',
  },
  {
    id: '8',
    name: 'THCa Flower Club',
    price: 167.98,
    image: 'https://images.unsplash.com/photo-1616690002178-4f1c78e65f8d?w=400&h=400&fit=crop',
  },
];

const categories = [
  { name: 'THCa Flower', href: '/shop/flower' },
  { name: 'THC Gummies', href: '/shop/edibles' },
  { name: 'THCA Pre-Rolls', href: '/shop/prerolls' },
  { name: 'THCa Concentrates', href: '/shop/concentrates' },
  { name: 'THCA Vapes', href: '/shop/vapes' },
  { name: 'Best Sellers', href: '/shop/bestsellers' },
];

const testimonials = [
  {
    name: 'Mike T.',
    text: '"Vouched Flower is amazing, love the taste and had us geeked!"',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    name: 'Sarah K.',
    text: '"Love the THCA Carts and THCA Snowballs, Vouched is the only online dispensary I go to."',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    name: 'James R.',
    text: '"Love the Exotic THCA Smalls, they are a super good deal with the best flower you can find!"',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
];

const collabs = [
  { name: 'Wham by Lil Baby', href: '/shop/collabs/lil-baby', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' },
  { name: 'Hella Slumped', href: '/shop/collabs/hella-slumped', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop' },
  { name: 'OTF Doodie Lo', href: '/shop/collabs/doodie-lo', image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=400&fit=crop' },
  { name: 'Only Gas', href: '/shop/collabs/only-gas', image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=400&fit=crop' },
];

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartTotal] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, seconds: 0 });

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-03-01').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-cyan-400 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
        <span className="hidden sm:inline">Free Shipping on Orders Over $100</span>
        <span className="sm:hidden">Free Shipping Over $100</span>
        <span className="text-white">+</span>
        <Link to="/shop" className="underline font-bold hover:no-underline">SHOP NOW</Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-cyan-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Shop All Button */}
            <Link
              to="/shop"
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition"
            >
              SHOP ALL
            </Link>

            {/* Center - Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-display tracking-wider text-white drop-shadow-lg" style={{ fontFamily: 'cursive' }}>
                Vouched
              </span>
            </Link>

            {/* Right - Search, Account, Cart */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Search Products"
                  className="bg-transparent outline-none text-sm text-gray-700 w-32 lg:w-48"
                />
                <button className="bg-cyan-400 text-white p-1 rounded ml-2">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Account */}
              <Link to={ROUTES.LOGIN} className="p-2 text-white hover:text-gray-200 transition">
                <User className="w-6 h-6" />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center gap-1 text-white hover:text-gray-200 transition">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-cyan-500 border-t border-cyan-300">
            <div className="px-4 py-4 space-y-3">
              <Link to="/shop" className="block py-2 text-white hover:text-gray-200 transition font-medium">
                Shop All
              </Link>
              <Link to="/shop/flower" className="block py-2 text-white hover:text-gray-200 transition">
                THCA Flower
              </Link>
              <Link to="/shop/vapes" className="block py-2 text-white hover:text-gray-200 transition">
                Vapes
              </Link>
              <Link to="/shop/edibles" className="block py-2 text-white hover:text-gray-200 transition">
                Edibles
              </Link>
              <Link to={ROUTES.LOGIN} className="block py-2 text-white font-medium">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-cyan-500 font-medium mb-2">250,000+ Happy Customers</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                #1 Online<br />THCA Dispensary
              </h1>
              <p className="text-gray-600 text-lg mb-8">Legal Cannabis Delivered Nationwide</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop/flower"
                  className="inline-flex items-center justify-center bg-white border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition"
                >
                  Shop THCA Flower
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition"
                >
                  SHOP ALL
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=600&h=500&fit=crop"
                alt="Premium THCA Flower"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Banner */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            A Federal Hemp <span className="bg-red-600 px-2">BAN</span> Is Coming.
          </h2>
          <div className="flex justify-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-400">Days</div>
              <div className="text-3xl md:text-4xl font-mono font-bold">{String(countdown.days).padStart(2, '0')}</div>
            </div>
            <div className="text-3xl md:text-4xl font-bold">:</div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Hours</div>
              <div className="text-3xl md:text-4xl font-mono font-bold">{String(countdown.hours).padStart(2, '0')}</div>
            </div>
            <div className="text-3xl md:text-4xl font-bold">:</div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Seconds</div>
              <div className="text-3xl md:text-4xl font-mono font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6">The clock is ticking. We are fighting back.</p>
          <Link
            to="/about"
            className="inline-block bg-cyan-400 text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-500 transition"
          >
            LEARN MORE
          </Link>
        </div>
      </section>

      {/* Explore Our Favorites */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-500">EXPLORE OUR FAVORITES</h2>
            <Link
              to="/shop/bestsellers"
              className="bg-cyan-400 text-white px-6 py-2 rounded-md font-bold hover:bg-cyan-500 transition"
            >
              Shop All
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {topSellers.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex-shrink-0 w-48 group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-900 font-bold">From ${product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Find Your Perfect Product */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Find Your Perfect Product</h2>
            <Link to="/shop" className="text-cyan-500 font-medium hover:text-cyan-600 transition">
              Shop All
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="bg-cyan-400 text-white px-6 py-3 rounded-full font-medium hover:bg-cyan-500 transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free Sample Banner */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get A Free 3.5 Grams</h2>
          <p className="text-lg mb-6 opacity-90">
            We partnered with some of the biggest names to give everyone FREE THCA Flower.
          </p>
          <Link
            to="/free-sample"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition"
          >
            GRAB YOUR FREE GAS!
          </Link>
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Top Sellers</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="px-6 py-2 rounded-full font-medium bg-cyan-400 text-white">BUNDLES</button>
              <button className="px-6 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition">FLOWER</button>
              <button className="px-6 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition">BULK</button>
              <button className="px-6 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition">DEALS</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topSellers.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-900 font-bold">From ${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
            <div className="flex justify-center items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">4.9 out of 5 based on 2,000+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured In Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-500 text-sm font-medium mb-8">AS FEATURED IN</h2>
          <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap opacity-50">
            <span className="text-2xl font-bold text-gray-400">Forbes</span>
            <span className="text-2xl font-bold text-gray-400">Leafly</span>
            <span className="text-2xl font-bold text-gray-400">High Times</span>
            <span className="text-2xl font-bold text-gray-400">Weedmaps</span>
            <span className="text-2xl font-bold text-gray-400">Rolling Stone</span>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-12 md:py-16 bg-cyan-400">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Rewards Program</h2>
          <p className="text-lg mb-6 opacity-90">
            Earn points on every purchase and redeem them for discounts on future orders.
          </p>
          <Link
            to="/rewards"
            className="inline-block bg-white text-cyan-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition"
          >
            LEARN MORE
          </Link>
        </div>
      </section>

      {/* Family Owned Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Family Owned and Operated
              </h2>
              <p className="text-gray-600 mb-6">
                We're a family-owned business dedicated to providing the highest quality THCA products. Our commitment to excellence and customer satisfaction has made us the #1 online THCA dispensary.
              </p>
              <p className="text-gray-600 mb-6">
                Every product is carefully selected and third-party lab tested to ensure you receive only the best. We believe in transparency, quality, and building lasting relationships with our customers.
              </p>
              <Link
                to="/about"
                className="inline-block bg-cyan-400 text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-500 transition"
              >
                LEARN MORE ABOUT US
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop"
                alt="Our Team"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Join Our Community</h2>
            <p className="text-gray-400">Follow us on social media for exclusive deals and updates</p>
          </div>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-bold">500K+</p>
              <p className="text-gray-400">Instagram</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">250K+</p>
              <p className="text-gray-400">TikTok</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">100K+</p>
              <p className="text-gray-400">Facebook</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-gray-400">Twitter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Truck className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $77</p>
            </div>
            <div>
              <Shield className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Lab Tested</h3>
              <p className="text-sm text-gray-600">Third-party verified</p>
            </div>
            <div>
              <Leaf className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">100% Legal</h3>
              <p className="text-sm text-gray-600">2018 Farm Bill compliant</p>
            </div>
            <div>
              <Star className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Discreet Shipping</h3>
              <p className="text-sm text-gray-600">Plain packaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collabs Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Celebrity Collabs</h2>
            <p className="text-gray-600">Exclusive partnerships with your favorite artists</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collabs.map((collab) => (
              <Link
                key={collab.name}
                to={collab.href}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={collab.image}
                  alt={collab.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">{collab.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* THCA Flower Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">THCA Flower</h2>
            <Link to="/shop/flower" className="text-cyan-500 font-medium hover:text-cyan-600 transition">
              Shop All Flower
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topSellers.slice(4, 8).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-900 font-bold">From ${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-cyan-400">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-lg mb-6 opacity-90">
            Subscribe to our newsletter for exclusive deals, new product drops, and more.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold" style={{ fontFamily: 'cursive' }}>Vouched</span>
              </Link>
              <p className="text-gray-400 text-sm mb-4">
                Premium THCA flower and cannabis products delivered nationwide.
              </p>
              <p className="text-gray-500 text-xs">
                Must be 21+ to purchase. Products contain less than 0.3% Delta-9-THC.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Shop Collabs</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop/collabs/lil-baby" className="text-gray-400 hover:text-cyan-400 transition">Wham by Lil Baby</Link></li>
                <li><Link to="/shop/collabs/hella-slumped" className="text-gray-400 hover:text-cyan-400 transition">Hella Slumped</Link></li>
                <li><Link to="/shop/collabs/doodie-lo" className="text-gray-400 hover:text-cyan-400 transition">OTF Doodie Lo</Link></li>
                <li><Link to="/shop/collabs/only-gas" className="text-gray-400 hover:text-cyan-400 transition">Only Gas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Shop THCa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop/flower" className="text-gray-400 hover:text-cyan-400 transition">THCA Flower</Link></li>
                <li><Link to="/shop/gummies" className="text-gray-400 hover:text-cyan-400 transition">THC Gummies</Link></li>
                <li><Link to="/shop/prerolls" className="text-gray-400 hover:text-cyan-400 transition">THCA Pre-Rolls</Link></li>
                <li><Link to="/shop/concentrates" className="text-gray-400 hover:text-cyan-400 transition">THCA Concentrates</Link></li>
                <li><Link to="/shop/vapes" className="text-gray-400 hover:text-cyan-400 transition">THCA Vapes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Helpful Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-400 hover:text-cyan-400 transition">Who We Are</Link></li>
                <li><Link to="/rewards" className="text-gray-400 hover:text-cyan-400 transition">Rewards Program</Link></li>
                <li><Link to="/lab-results" className="text-gray-400 hover:text-cyan-400 transition">Lab Test Results</Link></li>
                <li><Link to="/free-sample" className="text-gray-400 hover:text-cyan-400 transition">Free THCA Sample</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Policies</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition">Privacy Policy</Link></li>
                <li><Link to="/refund" className="text-gray-400 hover:text-cyan-400 transition">Refund Policy</Link></li>
                <li><Link to="/shipping" className="text-gray-400 hover:text-cyan-400 transition">Shipping Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2025 Vouched. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition">
                  Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition">
                  Instagram
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition">
                  TikTok
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition">
                  Twitter
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition">
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
