import { useState } from 'react';
import { useAuth } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Select, Modal } from '@/components/ui';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Bell,
  Search,
  Filter,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type TabId = 'overview' | 'products' | 'orders' | 'analytics' | 'payments' | 'inventory';

interface Product {
  id: string;
  name: string;
  strain: string;
  type: string;
  price: number;
  unit: string;
  stock: number;
  thc?: number;
  cbd?: number;
  quality: string;
  status: 'active' | 'draft' | 'out_of_stock';
  views: number;
  sales: number;
  revenue: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  shippingAddress: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Payment {
  id: string;
  type: 'sale' | 'payout' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
  orderId?: string;
}

export function SellerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'OG Kush Premium',
      strain: 'OG Kush',
      type: 'Flower',
      price: 2800,
      unit: 'lb',
      stock: 45,
      thc: 24.5,
      cbd: 0.8,
      quality: 'INDOOR',
      status: 'active',
      views: 1250,
      sales: 180,
      revenue: 504000,
    },
    {
      id: '2',
      name: 'Blue Dream Outdoor',
      strain: 'Blue Dream',
      type: 'Flower',
      price: 1800,
      unit: 'lb',
      stock: 120,
      thc: 20.2,
      cbd: 1.2,
      quality: 'OUTDOOR',
      status: 'active',
      views: 980,
      sales: 340,
      revenue: 612000,
    },
    {
      id: '3',
      name: 'Gelato Indoor',
      strain: 'Gelato',
      type: 'Flower',
      price: 3200,
      unit: 'lb',
      stock: 0,
      thc: 26.8,
      cbd: 0.5,
      quality: 'INDOOR',
      status: 'out_of_stock',
      views: 1450,
      sales: 95,
      revenue: 304000,
    },
  ];

  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-001',
      customer: 'Green Leaf Distributors',
      customerEmail: 'orders@greenleaf.com',
      items: [
        { productId: '1', productName: 'OG Kush Premium', quantity: 10, price: 2800 },
      ],
      totalAmount: 28000,
      status: 'confirmed',
      paymentStatus: 'paid',
      orderDate: '2025-11-28',
      shippingAddress: '123 Main St, Brooklyn, NY 10001',
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-002',
      customer: 'Empire Cannabis Co',
      customerEmail: 'purchase@empirecannabis.com',
      items: [
        { productId: '2', productName: 'Blue Dream Outdoor', quantity: 25, price: 1800 },
      ],
      totalAmount: 45000,
      status: 'processing',
      paymentStatus: 'paid',
      orderDate: '2025-11-27',
      shippingAddress: '456 Broadway, Manhattan, NY 10013',
    },
  ];

  const mockPayments: Payment[] = [
    { id: '1', type: 'sale', amount: 28000, status: 'completed', date: '2025-11-28', description: 'Order ORD-2025-001', orderId: '1' },
    { id: '2', type: 'sale', amount: 45000, status: 'completed', date: '2025-11-27', description: 'Order ORD-2025-002', orderId: '2' },
    { id: '3', type: 'payout', amount: -65000, status: 'completed', date: '2025-11-25', description: 'Weekly payout' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard },
    { id: 'inventory' as const, label: 'Inventory', icon: AlertCircle },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'confirmed':
      case 'delivered':
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'out_of_stock':
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = mockProducts.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = mockProducts.reduce((sum, p) => sum + p.sales, 0);
  const totalViews = mockProducts.reduce((sum, p) => sum + p.views, 0);
  const activeProducts = mockProducts.filter(p => p.status === 'active').length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-marble via-white to-marble-dark">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-charcoal">Seller Dashboard</h1>
                <p className="text-sm text-slate mt-1">
                  {user?.firstName || 'Seller'} • License: {user?.licenseNumber || 'AUCP-00001'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 border-b border-gold/10 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium transition-all whitespace-nowrap ${
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

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate">Total Revenue</p>
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-charcoal">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                </Card>

                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate">Total Sales</p>
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-charcoal">{totalSales}</p>
                  <p className="text-xs text-blue-600 mt-1">615 units sold</p>
                </Card>

                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate">Active Products</p>
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-charcoal">{activeProducts}</p>
                  <p className="text-xs text-slate mt-1">of {mockProducts.length} total</p>
                </Card>

                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate">Total Views</p>
                    <Eye className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-charcoal">{totalViews.toLocaleString()}</p>
                  <p className="text-xs text-gold mt-1">+8.3% this week</p>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Recent Orders</h2>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors bg-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-medium text-charcoal">{order.orderNumber}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate">{order.customer}</p>
                          <p className="text-xs text-slate mt-1">{order.items.length} item(s) • {order.orderDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(order.totalAmount)}</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Low Stock Alerts */}
              <Card className="p-6 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-2">Low Stock Alert</h3>
                    <p className="text-sm text-slate mb-3">1 product is out of stock</p>
                    <Button size="sm" onClick={() => setActiveTab('inventory')}>
                      Manage Inventory
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex flex-col md:flex-row gap-3 flex-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button onClick={() => setIsProductModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Products Table */}
              <Card className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/10 text-left">
                        <th className="pb-3 text-sm font-medium text-slate">Product</th>
                        <th className="pb-3 text-sm font-medium text-slate">Price</th>
                        <th className="pb-3 text-sm font-medium text-slate">Stock</th>
                        <th className="pb-3 text-sm font-medium text-slate">Views</th>
                        <th className="pb-3 text-sm font-medium text-slate">Sales</th>
                        <th className="pb-3 text-sm font-medium text-slate">Revenue</th>
                        <th className="pb-3 text-sm font-medium text-slate">Status</th>
                        <th className="pb-3 text-sm font-medium text-slate">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProducts.map((product) => (
                        <tr key={product.id} className="border-b border-gold/5 hover:bg-gold/5">
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-charcoal">{product.name}</p>
                              <p className="text-xs text-slate">{product.type} • {product.quality}</p>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-charcoal">{formatCurrency(product.price)}/{product.unit}</td>
                          <td className="py-4 text-sm text-charcoal">{product.stock} {product.unit}s</td>
                          <td className="py-4 text-sm text-slate">{product.views}</td>
                          <td className="py-4 text-sm text-slate">{product.sales}</td>
                          <td className="py-4 text-sm font-medium text-green-600">{formatCurrency(product.revenue)}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(product.status)}`}>
                              {product.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => { setSelectedProduct(product); setIsProductModalOpen(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-slate mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-charcoal">{mockOrders.length}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-slate mb-1">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">{mockOrders.filter(o => o.status === 'pending').length}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-slate mb-1">Processing</p>
                  <p className="text-2xl font-bold text-purple-600">{mockOrders.filter(o => o.status === 'processing').length}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-slate mb-1">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{mockOrders.filter(o => o.status === 'delivered').length}</p>
                </Card>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-medium text-charcoal">{order.orderNumber}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal font-medium">{order.customer}</p>
                        <p className="text-xs text-slate">{order.customerEmail}</p>
                        <p className="text-xs text-slate mt-1">Ordered: {order.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                      </div>
                    </div>

                    <div className="border-t border-gold/10 pt-4">
                      <p className="text-sm font-medium text-charcoal mb-2">Order Items:</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1">
                          <span className="text-slate">{item.productName} × {item.quantity}</span>
                          <span className="text-charcoal">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Update Status</Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Payment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                  <p className="text-sm text-slate mb-2">Available Balance</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(8000)}</p>
                  <Button size="sm" className="mt-4">
                    Request Payout
                  </Button>
                </Card>
                <Card className="p-6">
                  <p className="text-sm text-slate mb-2">Pending Payments</p>
                  <p className="text-3xl font-bold text-charcoal">{formatCurrency(0)}</p>
                  <p className="text-xs text-slate mt-2">0 orders awaiting payment</p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm text-slate mb-2">Last Payout</p>
                  <p className="text-3xl font-bold text-charcoal">{formatCurrency(65000)}</p>
                  <p className="text-xs text-slate mt-2">Nov 25, 2025</p>
                </Card>
              </div>

              {/* Transaction History */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Transaction History</h2>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="space-y-2">
                  {mockPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-gold/10 bg-white">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.type === 'sale' ? 'bg-green-100' :
                          payment.type === 'payout' ? 'bg-blue-100' :
                          'bg-red-100'
                        }`}>
                          {payment.type === 'sale' ? <DollarSign className="w-5 h-5 text-green-600" /> :
                           payment.type === 'payout' ? <CreditCard className="w-5 h-5 text-blue-600" /> :
                           <AlertCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{payment.description}</p>
                          <p className="text-xs text-slate">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${payment.amount > 0 ? 'text-green-600' : 'text-charcoal'}`}>
                          {payment.amount > 0 ? '+' : ''}{formatCurrency(payment.amount)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
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
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-4">Sales Analytics</h2>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gold/5 to-purple/5 rounded-lg">
                  <p className="text-slate">Revenue chart visualization would go here</p>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-charcoal mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {mockProducts.sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((product, idx) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gold">{idx + 1}</span>
                          <div>
                            <p className="text-sm font-medium text-charcoal">{product.name}</p>
                            <p className="text-xs text-slate">{product.sales} sales</p>
                          </div>
                        </div>
                        <p className="font-semibold text-green-600">{formatCurrency(product.revenue)}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-charcoal mb-4">Customer Insights</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate">Total Customers</span>
                      <span className="text-lg font-semibold text-charcoal">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate">Repeat Customers</span>
                      <span className="text-lg font-semibold text-charcoal">18 (75%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate">Avg. Order Value</span>
                      <span className="text-lg font-semibold text-green-600">{formatCurrency(36500)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">Inventory Management</h2>
                  <p className="text-sm text-slate mt-1">Track and manage your product stock levels</p>
                </div>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Update
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mockProducts.map((product) => (
                  <Card key={product.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal mb-1">{product.name}</h3>
                        <p className="text-sm text-slate">{product.type} • {product.quality}</p>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate">Stock Level</span>
                            <span className={`text-sm font-medium ${
                              product.stock === 0 ? 'text-red-600' :
                              product.stock < 20 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {product.stock} {product.unit}s
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                product.stock === 0 ? 'bg-red-600' :
                                product.stock < 20 ? 'bg-yellow-600' :
                                'bg-green-600'
                              }`}
                              style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Add stock"
                          className="w-24"
                        />
                        <Button size="sm">Update</Button>
                      </div>
                    </div>

                    {product.stock === 0 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-800">Out of stock - Product is hidden from buyers</span>
                      </div>
                    )}

                    {product.stock > 0 && product.stock < 20 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">Low stock - Consider restocking soon</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <div className="space-y-4">
          <Input label="Product Name" placeholder="e.g., OG Kush Premium" required />
          <Input label="Strain" placeholder="e.g., OG Kush" required />

          <Select label="Product Type" required>
            <option value="">Select type...</option>
            <option value="Flower">Flower</option>
            <option value="Concentrate">Concentrate</option>
            <option value="Edible">Edible</option>
            <option value="Pre-Roll">Pre-Roll</option>
          </Select>

          <Select label="Quality Grade" required>
            <option value="">Select quality...</option>
            <option value="INDOOR">Indoor</option>
            <option value="LIGHT_ASSISTED">Light Assisted</option>
            <option value="OUTDOOR">Outdoor</option>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" placeholder="2800" required />
            <Select label="Unit" required>
              <option value="lb">per lb</option>
              <option value="oz">per oz</option>
              <option value="g">per gram</option>
            </Select>
          </div>

          <Input label="Initial Stock" type="number" placeholder="100" required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="THC %" type="number" step="0.1" placeholder="24.5" />
            <Input label="CBD %" type="number" step="0.1" placeholder="0.8" />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsProductModalOpen(false);
                setSelectedProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button>
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
