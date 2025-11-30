import { useState } from 'react';
import { useAuth } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Select, Modal } from '@/components/ui';
import {
  Users,
  Building2,
  ShoppingCart,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';

type TabId = 'customers' | 'orders' | 'quotes' | 'analytics';

interface Customer {
  id: string;
  name: string;
  licenseNumber: string;
  businessType: 'Distributor' | 'Processor' | 'Retailer';
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'confirmed' | 'in_fulfillment' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
}

interface OrderItem {
  id: string;
  productName: string;
  strain: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  createdDate: string;
}

export function SalesCRM() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('customers');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Mock data
  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Green Leaf Distributors',
      licenseNumber: 'AUDIS-12345',
      businessType: 'Distributor',
      contactName: 'John Smith',
      email: 'john@greenleaf.com',
      phone: '(555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      status: 'active',
      totalOrders: 45,
      totalRevenue: 125000,
      lastOrderDate: '2025-11-25',
    },
    {
      id: '2',
      name: 'Empire State Processing',
      licenseNumber: 'AUCP-67890',
      businessType: 'Processor',
      contactName: 'Jane Doe',
      email: 'jane@empirestate.com',
      phone: '(555) 987-6543',
      address: '456 Broadway, Brooklyn, NY 11211',
      status: 'active',
      totalOrders: 23,
      totalRevenue: 87500,
      lastOrderDate: '2025-11-28',
    },
  ];

  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-001',
      customerId: '1',
      customerName: 'Green Leaf Distributors',
      items: [
        {
          id: '1',
          productName: 'OG Kush - Premium Flower',
          strain: 'OG Kush',
          quantity: 10,
          unit: 'lbs',
          pricePerUnit: 2500,
          totalPrice: 25000,
        },
        {
          id: '2',
          productName: 'Blue Dream - Premium Flower',
          strain: 'Blue Dream',
          quantity: 5,
          unit: 'lbs',
          pricePerUnit: 2300,
          totalPrice: 11500,
        },
      ],
      totalAmount: 36500,
      status: 'confirmed',
      orderDate: '2025-11-25',
      deliveryDate: '2025-12-02',
      paymentStatus: 'paid',
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-002',
      customerId: '2',
      customerName: 'Empire State Processing',
      items: [
        {
          id: '3',
          productName: 'Gelato - Premium Flower',
          strain: 'Gelato',
          quantity: 15,
          unit: 'lbs',
          pricePerUnit: 2600,
          totalPrice: 39000,
        },
      ],
      totalAmount: 39000,
      status: 'in_fulfillment',
      orderDate: '2025-11-28',
      deliveryDate: '2025-12-05',
      paymentStatus: 'unpaid',
    },
  ];

  const mockQuotes: Quote[] = [
    {
      id: '1',
      quoteNumber: 'QUO-2025-001',
      customerId: '1',
      customerName: 'Green Leaf Distributors',
      items: [
        {
          id: '1',
          productName: 'Wedding Cake - Premium Flower',
          strain: 'Wedding Cake',
          quantity: 20,
          unit: 'lbs',
          pricePerUnit: 2700,
          totalPrice: 54000,
        },
      ],
      totalAmount: 54000,
      status: 'sent',
      validUntil: '2025-12-15',
      createdDate: '2025-11-29',
    },
  ];

  const tabs = [
    { id: 'customers' as const, label: 'Customers', icon: Users },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'quotes' as const, label: 'Quotes', icon: FileText },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'paid':
      case 'accepted':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'sent':
      case 'unpaid':
      case 'in_fulfillment':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'cancelled':
      case 'rejected':
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-marble via-white to-marble-dark">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-gold" />
                  <div>
                    <h1 className="text-2xl font-semibold text-charcoal">B2B Sales CRM</h1>
                    <p className="text-sm text-slate">
                      Customer Relationship Management • License: {user?.licenseNumber || 'AUCC-00001'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate">Active Customers</p>
                      <p className="text-lg font-semibold text-blue-700">{mockCustomers.filter(c => c.status === 'active').length}</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-slate">Total Revenue</p>
                      <p className="text-lg font-semibold text-green-700">
                        {formatCurrency(mockCustomers.reduce((sum, c) => sum + c.totalRevenue, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 border-b border-gold/10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-gold border-b-2 border-gold bg-gold/5'
                        : 'text-slate hover:text-charcoal hover:bg-black/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Customer Database</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                      <Input placeholder="Search customers..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => setIsCustomerModalOpen(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Customer
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-4 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-charcoal">{customer.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(customer.status)}`}>
                              {customer.status}
                            </span>
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              {customer.businessType}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate mb-1">Contact</p>
                              <p className="text-charcoal font-medium">{customer.contactName}</p>
                              <div className="flex items-center gap-1 text-slate mt-1">
                                <Mail className="w-3 h-3" />
                                <span className="text-xs">{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate mt-1">
                                <Phone className="w-3 h-3" />
                                <span className="text-xs">{customer.phone}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-slate mb-1">License</p>
                              <p className="font-mono text-xs text-charcoal">{customer.licenseNumber}</p>
                              <div className="flex items-center gap-1 text-slate mt-1">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs">{customer.address}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-slate mb-1">Performance</p>
                              <p className="text-charcoal font-semibold">{customer.totalOrders} orders</p>
                              <p className="text-green-600 font-semibold">{formatCurrency(customer.totalRevenue)}</p>
                            </div>

                            <div>
                              <p className="text-slate mb-1">Last Order</p>
                              <p className="text-charcoal">
                                {customer.lastOrderDate
                                  ? new Date(customer.lastOrderDate).toLocaleDateString()
                                  : 'No orders'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm">
                            Create Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Active Orders</p>
                      <p className="text-2xl font-semibold text-charcoal">
                        {mockOrders.filter(o => ['confirmed', 'in_fulfillment', 'shipped'].includes(o.status)).length}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Pending</p>
                      <p className="text-2xl font-semibold text-charcoal">
                        {mockOrders.filter(o => o.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Delivered</p>
                      <p className="text-2xl font-semibold text-charcoal">
                        {mockOrders.filter(o => o.status === 'delivered').length}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Total Value</p>
                      <p className="text-2xl font-semibold text-charcoal">
                        {formatCurrency(mockOrders.reduce((sum, o) => sum + o.totalAmount, 0))}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Orders List */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">All Orders</h2>
                  <Button onClick={() => setIsOrderModalOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-charcoal">{order.orderNumber}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                          <p className="text-sm text-slate">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                          <p className="text-xs text-slate">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gold/10 pt-3">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex-1">
                                <span className="text-charcoal font-medium">{item.productName}</span>
                                <span className="text-slate ml-2">
                                  ({item.quantity} {item.unit} @ {formatCurrency(item.pricePerUnit)}/{item.unit})
                                </span>
                              </div>
                              <span className="font-semibold text-charcoal">{formatCurrency(item.totalPrice)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gold/10">
                        <div className="flex items-center gap-4 text-xs text-slate">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                          {order.deliveryDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          Manage Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Sales Quotes</h2>
                  <Button onClick={() => setIsQuoteModalOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Quote
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="p-4 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-charcoal">{quote.quoteNumber}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate mb-3">{quote.customerName}</p>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-slate">Total Amount</p>
                              <p className="text-lg font-bold text-green-600">{formatCurrency(quote.totalAmount)}</p>
                            </div>
                            <div>
                              <p className="text-slate">Created</p>
                              <p className="text-charcoal">{new Date(quote.createdDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-slate">Valid Until</p>
                              <p className="text-charcoal">{new Date(quote.validUntil).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Quote
                          </Button>
                          <Button size="sm">
                            Convert to Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-slate mb-4">Revenue by Customer Type</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">Distributors</span>
                      <span className="font-semibold text-green-600">{formatCurrency(125000)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">Processors</span>
                      <span className="font-semibold text-green-600">{formatCurrency(87500)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">Retailers</span>
                      <span className="font-semibold text-green-600">{formatCurrency(0)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-medium text-slate mb-4">Top Products</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">OG Kush</span>
                      <span className="font-semibold">10 lbs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">Gelato</span>
                      <span className="font-semibold">15 lbs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">Blue Dream</span>
                      <span className="font-semibold">5 lbs</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-medium text-slate mb-4">Order Status Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">Confirmed</span>
                      <span className="font-semibold text-blue-600">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">In Fulfillment</span>
                      <span className="font-semibold text-yellow-600">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-charcoal">Delivered</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} title="Add New Customer">
        <div className="space-y-4">
          <Input label="Company Name" placeholder="Business name" required />
          <Input label="License Number" placeholder="AUDIS-12345" required />
          <Select label="Business Type" required>
            <option value="">Select type...</option>
            <option value="distributor">Distributor</option>
            <option value="processor">Processor</option>
            <option value="retailer">Retailer</option>
          </Select>
          <Input label="Contact Name" placeholder="Full name" required />
          <Input label="Email" type="email" placeholder="email@example.com" required />
          <Input label="Phone" type="tel" placeholder="(555) 123-4567" required />
          <Input label="Address" placeholder="Street address" required />
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button>Add Customer</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Create New Order">
        <div className="space-y-4">
          <Select label="Customer" required>
            <option value="">Select customer...</option>
            {mockCustomers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Input label="Delivery Date" type="date" required />
          <p className="text-sm text-slate">Add line items after creating order</p>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Order</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} title="Create Sales Quote">
        <div className="space-y-4">
          <Select label="Customer" required>
            <option value="">Select customer...</option>
            {mockCustomers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Input label="Valid Until" type="date" required />
          <p className="text-sm text-slate">Add line items after creating quote</p>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsQuoteModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Quote</Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
