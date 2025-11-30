import { useState } from 'react';
import { useAuth } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Select, Modal } from '@/components/ui';
import { AIAssistant } from '@/components/AIAssistant';
import { DynamicView } from '@/components/DynamicView';
import type { ViewConfiguration } from '@/services/aiAssistant';
import {
  Shield,
  Package,
  FileText,
  AlertTriangle,
  Download,
  Leaf,
  MapPin,
  Beaker,
  Truck,
  Settings as SettingsIcon,
  Plus,
  Search,
  Filter,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  Wifi,
  WifiOff,
} from 'lucide-react';

type TabId = 'cultivation' | 'inventory' | 'distribution' | 'settings';

interface PlantBatch {
  id: string;
  name: string;
  type: 'Seed' | 'Clone';
  count: number;
  strain: string;
  location: string;
  plantedDate: string;
  status: 'active' | 'harvested' | 'destroyed';
}

interface Plant {
  id: string;
  label: string; // UID
  strain: string;
  location: string;
  phase: 'vegetative' | 'flowering' | 'harvested';
  plantedDate: string;
  floweringDate?: string;
  status: 'active' | 'harvested' | 'destroyed';
}

interface MetrcPackage {
  id: string;
  label: string; // UID
  productName: string;
  type: string;
  quantity: number;
  unit: string;
  thc?: number;
  cbd?: number;
  status: 'active' | 'testing' | 'quarantine' | 'in_transit' | 'sold';
  createdAt: Date;
  retailItemId?: string;
}

interface TransferManifest {
  id: string;
  manifestNumber: string;
  origin: string;
  destination: string;
  driver: string;
  vehicle: string;
  packages: number;
  status: 'draft' | 'pending' | 'in_transit' | 'delivered';
  departureDate?: string;
  arrivalDate?: string;
}

interface Strain {
  id: string;
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  thcRange: string;
  cbdRange: string;
  testingStatus: 'pending' | 'passed' | 'failed';
}

interface Location {
  id: string;
  name: string;
  type: 'Planting' | 'Vegetation' | 'Flowering' | 'Drying' | 'Packaging' | 'Quarantine';
  capacity: number;
  occupied: number;
}

export function CompliancePortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('cultivation');
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync] = useState<Date>(new Date());

  // Modal states
  const [isPlantBatchModalOpen, setIsPlantBatchModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  // AI Assistant view configuration
  const [viewConfig, setViewConfig] = useState<ViewConfiguration>({
    layout: 'table',
    density: 'comfortable',
  });

  const handleViewConfigChange = (newConfig: ViewConfiguration) => {
    setViewConfig(newConfig);
  };

  // Mock data - will be replaced with real METRC API calls
  const mockPlantBatches: PlantBatch[] = [
    { id: '1', name: 'OG-CLONE-001', type: 'Clone', count: 100, strain: 'OG Kush', location: 'Clone Room A', plantedDate: '2025-11-15', status: 'active' },
    { id: '2', name: 'BD-SEED-002', type: 'Seed', count: 75, strain: 'Blue Dream', location: 'Germination B', plantedDate: '2025-11-20', status: 'active' },
  ];

  const mockPlants: Plant[] = [
    { id: '1', label: '1A4FF0300000001', strain: 'OG Kush', location: 'Veg Room 1', phase: 'vegetative', plantedDate: '2025-10-01', status: 'active' },
    { id: '2', label: '1A4FF0300000002', strain: 'Blue Dream', location: 'Flower Room 2', phase: 'flowering', plantedDate: '2025-09-15', floweringDate: '2025-10-20', status: 'active' },
  ];

  const mockPackages: MetrcPackage[] = [
    { id: '1', label: '1A4FF0300000022000001', productName: 'OG Kush - Flower', type: 'Flower', quantity: 100, unit: 'grams', thc: 24.3, cbd: 0.5, status: 'active', createdAt: new Date(), retailItemId: 'RETAIL-001' },
    { id: '2', label: '1A4FF0300000022000002', productName: 'Blue Dream - Flower', type: 'Flower', quantity: 250, unit: 'grams', thc: 22.1, cbd: 0.8, status: 'testing', createdAt: new Date() },
  ];

  const mockManifests: TransferManifest[] = [
    { id: '1', manifestNumber: 'MAN-2025-001', origin: 'Cultivation Facility A', destination: 'Processing Facility B', driver: 'John Doe', vehicle: 'VAN-123', packages: 5, status: 'in_transit', departureDate: '2025-11-28' },
    { id: '2', manifestNumber: 'MAN-2025-002', origin: 'Processing Facility B', destination: 'Distribution Center', driver: 'Jane Smith', vehicle: 'TRUCK-456', packages: 12, status: 'delivered', departureDate: '2025-11-25', arrivalDate: '2025-11-26' },
  ];

  const mockStrains: Strain[] = [
    { id: '1', name: 'OG Kush', type: 'Indica', thcRange: '20-25%', cbdRange: '0.3-0.8%', testingStatus: 'passed' },
    { id: '2', name: 'Blue Dream', type: 'Sativa', thcRange: '18-24%', cbdRange: '0.5-1.2%', testingStatus: 'passed' },
    { id: '3', name: 'Gelato', type: 'Hybrid', thcRange: '20-26%', cbdRange: '0.1-0.5%', testingStatus: 'pending' },
  ];

  const mockLocations: Location[] = [
    { id: '1', name: 'Clone Room A', type: 'Planting', capacity: 500, occupied: 100 },
    { id: '2', name: 'Veg Room 1', type: 'Vegetation', capacity: 300, occupied: 45 },
    { id: '3', name: 'Flower Room 2', type: 'Flowering', capacity: 200, occupied: 180 },
    { id: '4', name: 'Drying Room', type: 'Drying', capacity: 150, occupied: 75 },
  ];

  const tabs = [
    { id: 'cultivation' as const, label: 'Cultivation', icon: Leaf },
    { id: 'inventory' as const, label: 'Inventory', icon: Package },
    { id: 'distribution' as const, label: 'Distribution', icon: Truck },
    { id: 'settings' as const, label: 'Settings', icon: SettingsIcon },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'testing':
      case 'pending':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'quarantine':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                  <Shield className="w-8 h-8 text-gold" />
                  <div>
                    <h1 className="text-2xl font-semibold text-charcoal">METRC Compliance Portal</h1>
                    <p className="text-sm text-slate">
                      License: {user?.licenseNumber || 'AUCC-00001'} • NYS OCM
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Sync Status */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gold/20">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-slate">
                        Last sync: {lastSync.toLocaleTimeString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-slate">Offline Mode</span>
                    </>
                  )}
                </div>

                {/* Compliance Score */}
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-slate">Compliance Score</p>
                      <p className="text-lg font-semibold text-green-700">98.7%</p>
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
          {/* CULTIVATION TAB */}
          {activeTab === 'cultivation' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Plant Batches</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockPlantBatches.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Active Plants</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockPlants.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Locations</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockLocations.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Beaker className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Strains</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockStrains.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Plant Batches Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Plant Batches</h2>
                  <Button onClick={() => setIsPlantBatchModalOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Batch
                  </Button>
                </div>

                <div className="space-y-2">
                  {mockPlantBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="p-4 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-charcoal">{batch.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(batch.status)}`}>
                              {batch.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 mt-2 text-sm text-slate">
                            <span>Strain: {batch.strain}</span>
                            <span>Count: {batch.count} plants</span>
                            <span>Location: {batch.location}</span>
                            <span>Planted: {new Date(batch.plantedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Plants Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Individual Plants (UIDs)</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                      <Input placeholder="Search UIDs..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/10 text-left">
                        <th className="pb-3 text-sm font-medium text-slate">UID Label</th>
                        <th className="pb-3 text-sm font-medium text-slate">Strain</th>
                        <th className="pb-3 text-sm font-medium text-slate">Location</th>
                        <th className="pb-3 text-sm font-medium text-slate">Phase</th>
                        <th className="pb-3 text-sm font-medium text-slate">Planted Date</th>
                        <th className="pb-3 text-sm font-medium text-slate">Status</th>
                        <th className="pb-3 text-sm font-medium text-slate">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPlants.map((plant) => (
                        <tr key={plant.id} className="border-b border-gold/5 hover:bg-gold/5">
                          <td className="py-3 text-sm font-mono text-charcoal">{plant.label}</td>
                          <td className="py-3 text-sm text-charcoal">{plant.strain}</td>
                          <td className="py-3 text-sm text-slate">{plant.location}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plant.phase)}`}>
                              {plant.phase}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-slate">{new Date(plant.plantedDate).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plant.status)}`}>
                              {plant.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">
                              Move
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Rooms/Locations Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Cultivation Locations</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {mockLocations.map((location) => (
                    <div key={location.id} className="p-4 rounded-lg border border-gold/10 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-charcoal">{location.name}</h3>
                          <p className="text-sm text-slate mt-1">{location.type}</p>
                        </div>
                        <MapPin className="w-5 h-5 text-gold" />
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate">Capacity</span>
                          <span className="text-charcoal font-medium">
                            {location.occupied} / {location.capacity}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all"
                            style={{ width: `${(location.occupied / location.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Strains Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Strain Library</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Strain
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {mockStrains.map((strain) => (
                    <div key={strain.id} className="p-4 rounded-lg border border-gold/10 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-charcoal">{strain.name}</h3>
                        {strain.testingStatus === 'passed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : strain.testingStatus === 'failed' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate">Type:</span>
                          <span className="text-charcoal font-medium">{strain.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate">THC:</span>
                          <span className="text-charcoal font-medium">{strain.thcRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate">CBD:</span>
                          <span className="text-charcoal font-medium">{strain.cbdRange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Active Packages</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockPackages.filter(p => p.status === 'active').length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Beaker className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">In Testing</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockPackages.filter(p => p.status === 'testing').length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Retail Items</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockPackages.filter(p => p.retailItemId).length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Quarantined</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockPackages.filter(p => p.status === 'quarantine').length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Packages Table - Dynamic View with AI Assistant */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">METRC Packages</h2>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsPackageModalOpen(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Package
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <DynamicView
                  data={mockPackages}
                  config={viewConfig}
                  onItemClick={(pkg) => console.log('Package clicked:', pkg)}
                />
              </Card>
            </div>
          )}

          {/* DISTRIBUTION TAB */}
          {activeTab === 'distribution' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Active Manifests</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockManifests.filter(m => m.status === 'in_transit').length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Delivered</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockManifests.filter(m => m.status === 'delivered').length}</p>
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
                      <p className="text-2xl font-semibold text-charcoal">{mockManifests.filter(m => m.status === 'pending').length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate">Drafts</p>
                      <p className="text-2xl font-semibold text-charcoal">{mockManifests.filter(m => m.status === 'draft').length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Manifests Table */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Transfer Manifests</h2>
                  <Button onClick={() => setIsManifestModalOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Manifest
                  </Button>
                </div>

                <div className="space-y-2">
                  {mockManifests.map((manifest) => (
                    <div
                      key={manifest.id}
                      className="p-4 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-charcoal">{manifest.manifestNumber}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(manifest.status)}`}>
                              {manifest.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-slate">
                            <div>
                              <p className="text-xs text-slate mb-1">Origin</p>
                              <p className="text-charcoal">{manifest.origin}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate mb-1">Destination</p>
                              <p className="text-charcoal">{manifest.destination}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate mb-1">Driver</p>
                              <p className="text-charcoal">{manifest.driver}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate mb-1">Packages</p>
                              <p className="text-charcoal">{manifest.packages} items</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            Track
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-4">METRC API Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">Vendor API Key</label>
                    <Input type="password" placeholder="Enter vendor API key..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">User API Key</label>
                    <Input type="password" placeholder="Enter user API key..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">License Number</label>
                    <Input value={user?.licenseNumber || 'AUCC-00001'} disabled />
                  </div>
                  <Button>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-4">Offline Mode</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate">Enable offline mode to work without internet connection</p>
                    <p className="text-xs text-slate mt-1">Data will sync automatically when connection is restored</p>
                  </div>
                  <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isOnline ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isOnline ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-4">Label Templates</h2>
                <p className="text-sm text-slate mb-4">Customize label templates for packages, plants, and transfers</p>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Package Labels
                  </Button>
                  <Button variant="outline">
                    <Leaf className="w-4 h-4 mr-2" />
                    Plant Labels
                  </Button>
                  <Button variant="outline">
                    <Truck className="w-4 h-4 mr-2" />
                    Manifest Labels
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals - Simplified placeholders */}
      <Modal isOpen={isPlantBatchModalOpen} onClose={() => setIsPlantBatchModalOpen(false)} title="Create Plant Batch">
        <div className="space-y-4">
          <Input label="Batch Name" placeholder="e.g., OG-CLONE-001" required />
          <Select label="Batch Type" required>
            <option value="">Select type...</option>
            <option value="seed">Seed</option>
            <option value="clone">Clone</option>
          </Select>
          <Input label="Count" type="number" placeholder="Number of plants" required />
          <Input label="Strain" placeholder="Strain name" required />
          <Input label="Location" placeholder="Room/Location" required />
          <Input label="Planted Date" type="date" required />
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsPlantBatchModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Batch</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} title="Create Package">
        <div className="space-y-4">
          <Input label="Package UID" placeholder="1A4FF..." required />
          <Input label="Product Name" placeholder="Product name" required />
          <Select label="Product Type" required>
            <option value="">Select type...</option>
            <option value="flower">Flower</option>
            <option value="concentrate">Concentrate</option>
            <option value="edible">Edible</option>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" required />
            <Select label="Unit" required>
              <option value="grams">Grams</option>
              <option value="oz">Ounces</option>
              <option value="lbs">Pounds</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="THC %" type="number" step="0.1" />
            <Input label="CBD %" type="number" step="0.1" />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsPackageModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Package</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isManifestModalOpen} onClose={() => setIsManifestModalOpen(false)} title="Create Transfer Manifest">
        <div className="space-y-4">
          <Input label="Manifest Number" placeholder="MAN-2025-XXX" required />
          <Input label="Origin Facility" placeholder="Your facility" required />
          <Input label="Destination Facility" placeholder="Recipient facility" required />
          <Input label="Driver Name" placeholder="Full name" required />
          <Input label="Vehicle ID" placeholder="License plate" required />
          <Input label="Estimated Departure" type="datetime-local" required />
          <Input label="Estimated Arrival" type="datetime-local" required />
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsManifestModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Manifest</Button>
          </div>
        </div>
      </Modal>

      {/* AI Assistant */}
      <AIAssistant
        portalType="compliance"
        onViewConfigChange={handleViewConfigChange}
      />
    </AppLayout>
  );
}
