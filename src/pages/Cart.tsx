import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Leaf, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

// Sample cart items - in production this would come from state/context
const initialCartItems = [
  {
    id: '1',
    name: 'Premium THCA Flower',
    strain: 'Exotic Indoor',
    size: '3.5g (Eighth)',
    price: 39.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'THC Gummies',
    strain: '25mg Each',
    size: '10 Pack (250mg)',
    price: 29.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop',
  },
];

export function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 77 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-dark">
      {/* Announcement Bar */}
      <div className="bg-emerald-600 text-white text-center py-2 px-4 text-sm font-medium">
        {subtotal < 77 ? (
          <span>
            Add ${(77 - subtotal).toFixed(2)} more for{' '}
            <span className="font-bold">FREE SHIPPING!</span>
          </span>
        ) : (
          <span>
            🎉 You qualify for <span className="font-bold">FREE SHIPPING!</span>
          </span>
        )}
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
              <Link
                to="/shop"
                className="text-gray-300 hover:text-emerald-400 transition font-medium"
              >
                Shop All
              </Link>
              <Link
                to="/shop/flower"
                className="text-gray-300 hover:text-emerald-400 transition font-medium"
              >
                THCA Flower
              </Link>
              <Link
                to="/shop/vapes"
                className="text-gray-300 hover:text-emerald-400 transition font-medium"
              >
                Vapes
              </Link>
              <Link
                to="/shop/edibles"
                className="text-gray-300 hover:text-emerald-400 transition font-medium"
              >
                Edibles
              </Link>
            </nav>

            <Link
              to={ROUTES.LOGIN}
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-display tracking-wide text-white mb-8">
          SHOPPING CART
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-50 rounded-xl p-4 md:p-6 border border-white/5"
                >
                  <div className="flex gap-4">
                    <Link
                      to={`/product/${item.id}`}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-semibold text-white hover:text-emerald-400 transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-emerald-400">{item.strain}</p>
                      <p className="text-sm text-gray-500">{item.size}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-white/10 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-400 hover:text-white transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-400 hover:text-white transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition mt-4"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-dark-50 rounded-xl p-6 border border-white/5 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold text-xl text-white">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 bg-dark border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition">
                      Apply
                    </button>
                  </div>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-lg font-semibold text-lg transition">
                  Checkout
                </button>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
