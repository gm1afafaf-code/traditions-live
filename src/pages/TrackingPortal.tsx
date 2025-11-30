import { useState } from 'react';
import { useAuth } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Modal } from '@/components/ui';
import { AIAssistant } from '@/components/AIAssistant';
import type { ViewConfiguration } from '@/services/aiAssistant';
import { Truck, MapPin, Clock, Package, Navigation, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface Shipment {
  id: string;
  trackingNumber: string;
  manifestId: string;
  origin: string;
  destination: string;
  driver: string;
  vehicle: string;
  packages: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed';
  eta: string;
  departureTime?: string;
  arrivalTime?: string;
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'TRK-2025-001',
    manifestId: 'MAN-2025-001',
    origin: 'Hudson Valley Cultivation',
    destination: 'Brooklyn Processing',
    driver: 'John Smith',
    vehicle: 'NY-ABC-1234',
    packages: 12,
    status: 'in_transit',
    eta: '2h 15m',
    departureTime: '10:30 AM',
  },
  {
    id: '2',
    trackingNumber: 'TRK-2025-002',
    manifestId: 'MAN-2025-002',
    origin: 'Syracuse Processor',
    destination: 'Manhattan Distributor',
    driver: 'Jane Doe',
    vehicle: 'NY-XYZ-5678',
    packages: 8,
    status: 'delivered',
    eta: 'Delivered',
    departureTime: '08:00 AM',
    arrivalTime: '11:45 AM',
  },
  {
    id: '3',
    trackingNumber: 'TRK-2025-003',
    manifestId: 'MAN-2025-003',
    origin: 'Buffalo Cultivation',
    destination: 'Rochester Processing',
    driver: 'Mike Johnson',
    vehicle: 'NY-DEF-9012',
    packages: 15,
    status: 'pending',
    eta: '4h 30m',
  },
];

export function TrackingPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'history'>('active');
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // AI Assistant view configuration
  const [viewConfig, setViewConfig] = useState<ViewConfiguration>({
    layout: 'list',
    density: 'comfortable',
  });

  const handleViewConfigChange = (newConfig: ViewConfiguration) => {
    setViewConfig(newConfig);
  };

  const tabs = [
    { id: 'active' as const, label: 'Active Shipments', count: mockShipments.filter(s => s.status === 'in_transit').length },
    { id: 'pending' as const, label: 'Pending', count: mockShipments.filter(s => s.status === 'pending').length },
    { id: 'history' as const, label: 'History', count: mockShipments.filter(s => s.status === 'delivered').length },
  ];

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredShipments = mockShipments.filter(s => {
    if (activeTab === 'active') return s.status === 'in_transit';
    if (activeTab === 'pending') return s.status === 'pending';
    if (activeTab === 'history') return s.status === 'delivered';
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal flex items-center gap-3">
              <Navigation className="w-8 h-8 text-gold" />
              Delivery Tracking
            </h1>
            <p className="text-slate mt-1">License: {user?.licenseNumber}</p>
          </div>
          <Button onClick={() => setIsCreateShipmentOpen(true)}>
            <Truck className="w-4 h-4 mr-2" />
            Create Shipment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">Active Shipments</p>
                <p className="text-3xl font-bold text-charcoal mt-1">
                  {mockShipments.filter(s => s.status === 'in_transit').length}
                </p>
              </div>
              <Truck className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">Delivered Today</p>
                <p className="text-3xl font-bold text-charcoal mt-1">
                  {mockShipments.filter(s => s.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">Pending Pickup</p>
                <p className="text-3xl font-bold text-charcoal mt-1">
                  {mockShipments.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">On-Time Rate</p>
                <p className="text-3xl font-bold text-charcoal mt-1">98.5%</p>
              </div>
              <Navigation className="w-10 h-10 text-gold opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-slate hover:text-charcoal hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === tab.id ? 'bg-gold text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Shipments List */}
        <div className="space-y-4">
          {filteredShipments.map((shipment) => (
            <Card key={shipment.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedShipment(shipment)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(shipment.status)}`}>
                    {getStatusIcon(shipment.status)}
                    <span className="font-semibold capitalize">{shipment.status.replace('_', ' ')}</span>
                  </div>

                  {/* Tracking Info */}
                  <div>
                    <p className="font-mono text-sm text-slate">#{shipment.trackingNumber}</p>
                    <p className="font-semibold text-charcoal">{shipment.origin} → {shipment.destination}</p>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-6 text-sm text-slate">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>{shipment.packages} packages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>{shipment.driver}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>ETA: {shipment.eta}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {shipment.status === 'in_transit' && (
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Manifest
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredShipments.length === 0 && (
            <Card className="p-12 text-center">
              <Truck className="w-16 h-16 text-slate mx-auto mb-4 opacity-50" />
              <p className="text-slate">No {activeTab} shipments</p>
            </Card>
          )}
        </div>

        {/* Create Shipment Modal */}
        <Modal isOpen={isCreateShipmentOpen} onClose={() => setIsCreateShipmentOpen(false)} title="Create New Shipment">
          <form className="space-y-4">
            <Input label="Transfer Manifest ID" placeholder="MAN-2025-XXX" required />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Origin Facility" placeholder="Enter facility name" required />
              <Input label="Origin License #" placeholder="OCM-XXXX-XX-XXXXXX" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Destination Facility" placeholder="Enter facility name" required />
              <Input label="Destination License #" placeholder="OCM-XXXX-XX-XXXXXX" required />
            </div>

            <hr className="my-4" />

            <Input label="Driver Name" placeholder="John Smith" required />
            <Input label="Driver License #" placeholder="D123456" required />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Vehicle Make/Model" placeholder="Ford Transit" required />
              <Input label="License Plate" placeholder="NY-ABC-1234" required />
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Departure Date/Time" type="datetime-local" required />
              <Input label="Estimated Arrival" type="datetime-local" required />
            </div>

            <Input label="Number of Packages" type="number" placeholder="12" required />

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateShipmentOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Shipment</Button>
            </div>
          </form>
        </Modal>

        {/* Shipment Details Modal */}
        <Modal
          isOpen={!!selectedShipment}
          onClose={() => setSelectedShipment(null)}
          title={`Shipment Details - ${selectedShipment?.trackingNumber}`}
        >
          {selectedShipment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate">Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg mt-1 ${getStatusColor(selectedShipment.status)}`}>
                    {getStatusIcon(selectedShipment.status)}
                    <span className="font-semibold capitalize">{selectedShipment.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate">Manifest ID</p>
                  <p className="font-mono text-charcoal mt-1">{selectedShipment.manifestId}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate mb-2">Route</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-charcoal">{selectedShipment.origin}</p>
                    {selectedShipment.departureTime && (
                      <p className="text-sm text-slate">Departed: {selectedShipment.departureTime}</p>
                    )}
                  </div>
                  <div className="text-gold">→</div>
                  <div className="flex-1">
                    <p className="font-semibold text-charcoal">{selectedShipment.destination}</p>
                    {selectedShipment.arrivalTime ? (
                      <p className="text-sm text-green-600">Arrived: {selectedShipment.arrivalTime}</p>
                    ) : (
                      <p className="text-sm text-slate">ETA: {selectedShipment.eta}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate">Driver</p>
                  <p className="text-charcoal mt-1">{selectedShipment.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-slate">Vehicle</p>
                  <p className="text-charcoal mt-1">{selectedShipment.vehicle}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate">Packages</p>
                <p className="text-2xl font-bold text-charcoal mt-1">{selectedShipment.packages}</p>
              </div>

              {selectedShipment.status === 'in_transit' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    Update Status
                  </Button>
                  <Button className="flex-1">
                    Mark as Delivered
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        portalType="tracking"
        onViewConfigChange={handleViewConfigChange}
      />
    </AppLayout>
  );
}
