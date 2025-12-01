import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Select } from '@/components/ui';
import {
  CreditCard,
  Building2,
  MapPin,
  Check,
  ArrowLeft,
  Lock,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  seller: string;
  price: number;
  quantity: number;
  unit: string;
  thc?: number;
  cbd?: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'ach';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review' | 'confirmed';

export function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  // Mock cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 'p1',
      name: 'OG Kush Premium',
      seller: 'Hudson Valley Cultivation',
      price: 2800,
      quantity: 10,
      unit: 'lb',
      thc: 24.5,
      cbd: 0.8,
    },
    {
      id: '2',
      productId: 'p2',
      name: 'Blue Dream Outdoor',
      seller: 'Empire Gardens',
      price: 1800,
      quantity: 5,
      unit: 'lb',
      thc: 20.2,
      cbd: 1.2,
    },
  ]);

  const mockPaymentMethods: PaymentMethod[] = [
    { id: '1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
    { id: '2', type: 'bank', last4: '6789', bankName: 'Chase Bank', isDefault: false },
  ];

  const [orderNumber] = useState(`ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50000 ? 0 : 500; // Free shipping over $50k
  const total = subtotal + tax + shipping;

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const steps = [
    { id: 'cart' as const, label: 'Cart', icon: ShoppingCart },
    { id: 'shipping' as const, label: 'Shipping', icon: MapPin },
    { id: 'payment' as const, label: 'Payment', icon: CreditCard },
    { id: 'review' as const, label: 'Review', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-marble via-white to-marble-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/vault')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vault
            </Button>
            <h1 className="text-3xl md:text-4xl font-semibold text-charcoal">Checkout</h1>
            {currentStep !== 'confirmed' && (
              <p className="text-slate text-sm mt-1">
                Complete your purchase securely
              </p>
            )}
          </div>

          {currentStep !== 'confirmed' && (
            <div className="mb-8">{/* Progress Steps */}
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = currentStepIndex === idx;
                  const isCompleted = currentStepIndex > idx;

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? 'bg-green-600 border-green-600'
                              : isActive
                              ? 'bg-gold border-gold'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          ) : (
                            <Icon
                              className={`w-5 h-5 md:w-6 md:h-6 ${
                                isActive ? 'text-white' : 'text-gray-400'
                              }`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-xs md:text-sm mt-2 font-medium ${
                            isActive || isCompleted ? 'text-charcoal' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 ${
                            currentStepIndex > idx ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* CART STEP */}
              {currentStep === 'cart' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-4">Shopping Cart</h2>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-slate mx-auto mb-4 opacity-50" />
                      <p className="text-slate">Your cart is empty</p>
                      <Button onClick={() => navigate('/vault')} className="mt-4">
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gold/10 bg-white"
                        >
                          <div className="w-full md:w-24 h-24 bg-marble-dark rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">🌱</span>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-medium text-charcoal">{item.name}</h3>
                            <p className="text-sm text-slate">{item.seller}</p>
                            {item.thc && (
                              <p className="text-xs text-slate mt-1">
                                THC: {item.thc}% • CBD: {item.cbd}%
                              </p>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <span className="text-sm text-slate">{item.unit}s</span>
                            </div>
                          </div>

                          <div className="text-right flex flex-col justify-between">
                            <div>
                              <p className="text-sm text-slate">
                                {formatCurrency(item.price)}/{item.unit}
                              </p>
                              <p className="text-lg font-semibold text-charcoal mt-1">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        onClick={() => setCurrentStep('shipping')}
                        className="w-full mt-6"
                        disabled={cartItems.length === 0}
                      >
                        Continue to Shipping
                      </Button>
                    </div>
                  )}
                </Card>
              )}

              {/* SHIPPING STEP */}
              {currentStep === 'shipping' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-4">Shipping Information</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="First Name" defaultValue={user?.firstName} required />
                      <Input label="Last Name" defaultValue={user?.lastName} required />
                    </div>

                    <Input label="Company Name" defaultValue={user?.licenseNumber} required />
                    <Input label="License Number" defaultValue={user?.licenseNumber} required disabled />

                    <Input label="Street Address" placeholder="123 Main St" required />
                    <Input label="Apartment, suite, etc." placeholder="Apt 4B" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input label="City" placeholder="Brooklyn" required />
                      <Select label="State" required>
                        <option value="">Select state...</option>
                        <option value="NY">New York</option>
                      </Select>
                      <Input label="ZIP Code" placeholder="10001" required />
                    </div>

                    <Input label="Phone Number" type="tel" placeholder="(555) 123-4567" required />

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setCurrentStep('cart')}>
                        Back to Cart
                      </Button>
                      <Button onClick={() => setCurrentStep('payment')} className="flex-1">
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* PAYMENT STEP */}
              {currentStep === 'payment' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-4">Payment Method</h2>

                  {!isAddingPayment ? (
                    <div className="space-y-4">
                      {/* Saved Payment Methods */}
                      {mockPaymentMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedPayment === method.id
                              ? 'border-gold bg-gold/5'
                              : 'border-gray-200 hover:border-gold/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                {method.type === 'card' ? (
                                  <CreditCard className="w-5 h-5 text-gold" />
                                ) : (
                                  <Building2 className="w-5 h-5 text-gold" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-charcoal">
                                  {method.type === 'card'
                                    ? `${method.brand} •••• ${method.last4}`
                                    : `${method.bankName} •••• ${method.last4}`}
                                </p>
                                {method.isDefault && (
                                  <span className="text-xs text-gold">Default</span>
                                )}
                              </div>
                            </div>
                            {selectedPayment === method.id && (
                              <CheckCircle className="w-5 h-5 text-gold" />
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add New Payment Method */}
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingPayment(true)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Payment Method
                      </Button>

                      <div className="flex items-center gap-2 mt-6 p-4 bg-blue-50 rounded-lg">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-blue-900">
                          Your payment information is encrypted and secure
                        </p>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button variant="outline" onClick={() => setCurrentStep('shipping')}>
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep('review')}
                          className="flex-1"
                          disabled={!selectedPayment}
                        >
                          Review Order
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Add New Payment Form */
                    <div className="space-y-4">
                      <div className="flex gap-4 mb-4">
                        <Button
                          variant={isAddingPayment ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Credit Card
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Building2 className="w-4 h-4 mr-2" />
                          Bank Account
                        </Button>
                      </div>

                      <Input label="Card Number" placeholder="1234 5678 9012 3456" required />

                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM/YY" required />
                        <Input label="CVV" placeholder="123" required />
                      </div>

                      <Input label="Cardholder Name" placeholder="John Doe" required />

                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-slate">Set as default payment method</span>
                      </label>

                      <div className="flex gap-3 mt-6">
                        <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setIsAddingPayment(false);
                            setSelectedPayment('new');
                          }}
                          className="flex-1"
                        >
                          Save Payment Method
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* REVIEW STEP */}
              {currentStep === 'review' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-6">Review Your Order</h2>

                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg text-sm">
                        <p className="text-charcoal">{user?.firstName} {user?.lastName}</p>
                        <p className="text-slate">123 Main St, Apt 4B</p>
                        <p className="text-slate">Brooklyn, NY 10001</p>
                        <p className="text-slate">(555) 123-4567</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Method
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg text-sm">
                        <p className="text-charcoal">Visa •••• 4242</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-medium text-charcoal mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-charcoal">{item.name}</p>
                              <p className="text-xs text-slate">
                                {item.quantity} {item.unit}s × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <p className="font-medium text-charcoal">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setCurrentStep('payment')}>
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep('confirmed')} className="flex-1">
                        Place Order
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* CONFIRMATION */}
              {currentStep === 'confirmed' && (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-charcoal mb-2">
                    Order Confirmed!
                  </h2>
                  <p className="text-slate mb-4">
                    Your order has been successfully placed
                  </p>
                  <div className="inline-block px-4 py-2 bg-gold/10 rounded-lg mb-6">
                    <p className="text-sm text-slate">Order Number</p>
                    <p className="font-mono font-semibold text-gold text-lg">{orderNumber}</p>
                  </div>

                  <p className="text-sm text-slate mb-6">
                    We've sent a confirmation email to {user?.email || 'your email'}
                  </p>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => navigate('/vault')}>
                      Continue Shopping
                    </Button>
                    <Button onClick={() => navigate('/portal/sales-crm')}>
                      View Orders
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate">Subtotal ({cartItems.length} items)</span>
                    <span className="text-charcoal">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate">Shipping</span>
                    <span className="text-charcoal">
                      {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate">Tax (8%)</span>
                    <span className="text-charcoal">{formatCurrency(tax)}</span>
                  </div>

                  {shipping === 0 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-xs text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span>You've qualified for free shipping!</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gold/20 pt-4 mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-charcoal">Total</span>
                    <span className="text-2xl font-bold text-gold">{formatCurrency(total)}</span>
                  </div>
                </div>

                {currentStep === 'cart' && (
                  <div className="space-y-2">
                    <Input placeholder="Promo code" />
                    <Button variant="outline" size="sm" className="w-full">
                      Apply Code
                    </Button>
                  </div>
                )}
              </Card>

              {/* Trust Badges */}
              <Card className="p-4 mt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Verified Sellers</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span>METRC Compliant</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
