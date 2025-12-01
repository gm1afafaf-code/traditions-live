import { useState } from 'react';
import { useAuth } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Modal } from '@/components/ui';
import { AIAssistant } from '@/components/AIAssistant';
import type { ViewConfiguration } from '@/services/aiAssistant';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Package,
  Leaf,
  Users,
  Award,
  CheckCircle,
  MessageSquare,
  Send,
} from 'lucide-react';

type FilterType = 'all' | 'cultivator' | 'processor' | 'distributor' | 'retailer';

interface NetworkBusiness {
  id: string;
  name: string;
  licenseNumber: string;
  businessType: 'Cultivator' | 'Processor' | 'Distributor' | 'Retailer';
  description: string;
  location: string;
  city: string;
  state: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  productsCount: number;
  joinedDate: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  certifications: string[];
}

interface ProductListing {
  id: string;
  businessId: string;
  businessName: string;
  productName: string;
  strain: string;
  type: 'Flower' | 'Concentrate' | 'Edible' | 'Tincture';
  thcRange: string;
  cbdRange: string;
  pricePerUnit: number;
  unit: string;
  minOrder: number;
  available: number;
  quality: 'INDOOR' | 'LIGHT_ASSISTED' | 'OUTDOOR';
  imageUrl?: string;
}

export function Network() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<NetworkBusiness | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // AI Assistant view configuration
  const [_viewConfig, setViewConfig] = useState<ViewConfiguration>({
    layout: 'grid',
    density: 'comfortable',
  });

  const handleViewConfigChange = (newConfig: ViewConfiguration) => {
    setViewConfig(newConfig);
  };

  // Mock data - would come from Firebase/API
  const mockBusinesses: NetworkBusiness[] = [
    {
      id: '1',
      name: 'Green Valley Cultivation',
      licenseNumber: 'AUCC-12345',
      businessType: 'Cultivator',
      description: 'Premium indoor cultivation facility specializing in exotic strains. Family-owned and operated since 2021.',
      location: '123 Farm Road, Hudson Valley',
      city: 'Hudson Valley',
      state: 'NY',
      specialties: ['Exotic Strains', 'Indoor Growing', 'Organic'],
      rating: 4.8,
      reviewCount: 24,
      verified: true,
      productsCount: 15,
      joinedDate: '2021-06-15',
      contactEmail: 'contact@greenvalley.com',
      contactPhone: '(518) 555-0123',
      certifications: ['USDA Organic', 'Clean Green Certified'],
    },
    {
      id: '2',
      name: 'Empire State Extracts',
      licenseNumber: 'AUCP-67890',
      businessType: 'Processor',
      description: 'State-of-the-art processing facility producing premium concentrates and extracts.',
      location: '456 Industrial Pkwy, Brooklyn',
      city: 'Brooklyn',
      state: 'NY',
      specialties: ['Live Resin', 'Rosin', 'Distillate'],
      rating: 4.9,
      reviewCount: 31,
      verified: true,
      productsCount: 22,
      joinedDate: '2021-08-20',
      contactEmail: 'sales@empireextracts.com',
      contactPhone: '(718) 555-0456',
      certifications: ['ISO 9001', 'CGMP Certified'],
    },
    {
      id: '3',
      name: 'Metro Distribution Network',
      licenseNumber: 'AUDIS-11111',
      businessType: 'Distributor',
      description: 'Leading statewide distributor connecting cultivators with retailers. Fast, reliable, compliant delivery.',
      location: '789 Distribution Ave, Albany',
      city: 'Albany',
      state: 'NY',
      specialties: ['Statewide Coverage', 'Cold Chain', '24h Delivery'],
      rating: 4.7,
      reviewCount: 45,
      verified: true,
      productsCount: 150,
      joinedDate: '2021-05-10',
      contactEmail: 'logistics@metrodist.com',
      contactPhone: '(518) 555-0789',
      certifications: ['DOT Certified', 'METRC Integrated'],
    },
    {
      id: '4',
      name: 'Upstate Organics',
      licenseNumber: 'AUCC-22222',
      businessType: 'Cultivator',
      description: 'Certified organic outdoor cultivation. Sustainable farming practices with sun-grown cannabis.',
      location: '321 Mountain Rd, Adirondacks',
      city: 'Adirondacks',
      state: 'NY',
      specialties: ['Organic', 'Outdoor', 'Sustainable'],
      rating: 4.6,
      reviewCount: 18,
      verified: true,
      productsCount: 8,
      joinedDate: '2022-04-01',
      contactEmail: 'hello@upstateorganics.com',
      contactPhone: '(315) 555-0147',
      certifications: ['USDA Organic', 'Regenerative Organic Certified'],
    },
  ];

  const mockProducts: ProductListing[] = [
    {
      id: '1',
      businessId: '1',
      businessName: 'Green Valley Cultivation',
      productName: 'Purple Punch - Premium Flower',
      strain: 'Purple Punch',
      type: 'Flower',
      thcRange: '24-28%',
      cbdRange: '0.1-0.5%',
      pricePerUnit: 2800,
      unit: 'lb',
      minOrder: 1,
      available: 25,
      quality: 'INDOOR',
    },
    {
      id: '2',
      businessId: '1',
      businessName: 'Green Valley Cultivation',
      productName: 'Wedding Cake - Top Shelf',
      strain: 'Wedding Cake',
      type: 'Flower',
      thcRange: '25-30%',
      cbdRange: '0.2-0.6%',
      pricePerUnit: 3000,
      unit: 'lb',
      minOrder: 1,
      available: 15,
      quality: 'INDOOR',
    },
    {
      id: '3',
      businessId: '2',
      businessName: 'Empire State Extracts',
      productName: 'Live Resin - OG Kush',
      strain: 'OG Kush',
      type: 'Concentrate',
      thcRange: '75-85%',
      cbdRange: '0.5-2%',
      pricePerUnit: 15000,
      unit: 'lb',
      minOrder: 0.25,
      available: 5,
      quality: 'INDOOR',
    },
    {
      id: '4',
      businessId: '4',
      businessName: 'Upstate Organics',
      productName: 'Organic Sour Diesel',
      strain: 'Sour Diesel',
      type: 'Flower',
      thcRange: '18-22%',
      cbdRange: '0.3-0.8%',
      pricePerUnit: 2200,
      unit: 'lb',
      minOrder: 5,
      available: 50,
      quality: 'OUTDOOR',
    },
  ];

  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesFilter = activeFilter === 'all' || business.businessType.toLowerCase() === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filters: { id: FilterType; label: string; icon: any }[] = [
    { id: 'all', label: 'All Businesses', icon: Building2 },
    { id: 'cultivator', label: 'Cultivators', icon: Leaf },
    { id: 'processor', label: 'Processors', icon: Package },
    { id: 'distributor', label: 'Distributors', icon: TrendingUp },
    { id: 'retailer', label: 'Retailers', icon: Users },
  ];

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
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-gold" />
                  <div>
                    <h1 className="text-3xl font-semibold text-charcoal">Business Network</h1>
                    <p className="text-sm text-slate">
                      Discover and connect with NYS licensed cannabis businesses
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate">Network Members</p>
                      <p className="text-lg font-semibold text-blue-700">{mockBusinesses.length}</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-slate">Available Products</p>
                      <p className="text-lg font-semibold text-green-700">{mockProducts.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                <Input
                  placeholder="Search by name, location, or specialty..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === filter.id
                          ? 'bg-gold text-white shadow-lg'
                          : 'bg-white text-slate hover:bg-gold/10 border border-gold/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => {
              const businessProducts = mockProducts.filter(p => p.businessId === business.id);

              return (
                <Card key={business.id} className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
                  <div onClick={() => setSelectedBusiness(business)}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-charcoal group-hover:text-gold transition-colors">
                            {business.name}
                          </h3>
                          {business.verified && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded text-xs bg-gold/10 text-gold font-medium">
                            {business.businessType}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-charcoal">{business.rating}</span>
                            <span className="text-xs text-slate">({business.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-slate mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{business.city}, {business.state}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate mb-4 line-clamp-2">{business.description}</p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {business.specialties.slice(0, 3).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Certifications */}
                    {business.certifications.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gold/10">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-slate">{business.certifications.join(', ')}</span>
                      </div>
                    )}

                    {/* Products Preview */}
                    {businessProducts.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate mb-2">Featured Products</p>
                        <div className="space-y-2">
                          {businessProducts.slice(0, 2).map((product) => (
                            <div key={product.id} className="text-xs bg-gray-50 p-2 rounded">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-charcoal">{product.productName}</span>
                                <span className="text-green-600 font-semibold">
                                  {formatCurrency(product.pricePerUnit)}/{product.unit}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-slate">
                                <span>THC: {product.thcRange}</span>
                                <span>•</span>
                                <span>{product.available} {product.unit} available</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gold/10">
                      <div>
                        <p className="text-xs text-slate">Products</p>
                        <p className="text-lg font-semibold text-charcoal">{business.productsCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate">Member Since</p>
                        <p className="text-sm text-charcoal">
                          {new Date(business.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBusiness(business);
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBusiness(business);
                        setIsContactModalOpen(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-slate mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-charcoal mb-2">No businesses found</h3>
              <p className="text-slate">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title={`Contact ${selectedBusiness?.name}`}
      >
        {selectedBusiness && (
          <div className="space-y-4">
            <div className="bg-gold/5 p-4 rounded-lg">
              <h3 className="font-semibold text-charcoal mb-2">{selectedBusiness.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedBusiness.contactEmail}`} className="hover:text-gold">
                    {selectedBusiness.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedBusiness.contactPhone}`} className="hover:text-gold">
                    {selectedBusiness.contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedBusiness.location}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">Your Message</label>
              <textarea
                className="w-full px-3 py-2 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                rows={4}
                placeholder="Introduce yourself and your business inquiry..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">Your License</label>
              <Input value={user?.licenseNumber || ''} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">Your Name</label>
              <Input value={`${user?.firstName || ''} ${user?.lastName || ''}`} disabled />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Send contact request
                setIsContactModalOpen(false);
              }}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* AI Assistant */}
      <AIAssistant
        portalType="network"
        onViewConfigChange={handleViewConfigChange}
      />
    </AppLayout>
  );
}
