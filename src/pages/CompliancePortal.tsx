import { useState } from 'react';
import { useAuth } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Select, Modal } from '@/components/ui';
import { Shield, Package, FileText, Upload, AlertTriangle, Download } from 'lucide-react';

interface MetrcPackage {
  id: string;
  uid: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  thc: number;
  cbd: number;
  status: 'active' | 'testing' | 'quarantine' | 'sold';
  createdAt: Date;
}

interface TransferManifest {
  id: string;
  manifestNumber: string;
  origin: string;
  destination: string;
  packages: number;
  status: 'draft' | 'pending' | 'in_transit' | 'delivered';
  createdAt: Date;
}

const mockPackages: MetrcPackage[] = [
  { id: '1', uid: '1A4FF0300000022000001', name: 'OG Kush - Flower', type: 'Flower', quantity: 100, unit: 'grams', thc: 24.3, cbd: 0.5, status: 'active', createdAt: new Date() },
  { id: '2', uid: '1A4FF0300000022000002', name: 'Blue Dream - Flower', type: 'Flower', quantity: 250, unit: 'grams', thc: 22.1, cbd: 0.8, status: 'testing', createdAt: new Date() },
];

const mockManifests: TransferManifest[] = [
  { id: '1', manifestNumber: 'MAN-2025-001', origin: 'Cultivation Facility A', destination: 'Processing Facility B', packages: 5, status: 'in_transit', createdAt: new Date() },
  { id: '2', manifestNumber: 'MAN-2025-002', origin: 'Processing Facility B', destination: 'Distribution Center', packages: 12, status: 'delivered', createdAt: new Date() },
];

export function CompliancePortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'packages' | 'manifests' | 'tests'>('packages');
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  const tabs = [
    { id: 'packages' as const, label: 'METRC Packages', icon: Package },
    { id: 'manifests' as const, label: 'Transfer Manifests', icon: FileText },
    { id: 'tests' as const, label: 'Lab Tests & COAs', icon: Upload },
  ];

  const complianceScore = 98.7;
  const activePackages = mockPackages.filter(p => p.status === 'active').length;
  const pendingManifests = mockManifests.filter(m => m.status === 'pending' || m.status === 'in_transit').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal flex items-center gap-3">
              <Shield className="w-8 h-8 text-gold" />
              Compliance Portal
            </h1>
            <p className="text-slate mt-1">License: {user?.licenseNumber}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate">Compliance Score</p>
              <p className="text-2xl font-bold text-gold">{complianceScore}%</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">Active Packages</p>
                <p className="text-3xl font-bold text-charcoal mt-1">{activePackages}</p>
              </div>
              <Package className="w-10 h-10 text-gold opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">Pending Transfers</p>
                <p className="text-3xl font-bold text-charcoal mt-1">{pendingManifests}</p>
              </div>
              <FileText className="w-10 h-10 text-gold opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">Tests Pending</p>
                <p className="text-3xl font-bold text-charcoal mt-1">3</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-gold text-gold'
                      : 'border-transparent text-slate hover:text-charcoal hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-charcoal">METRC Packages</h2>
              <Button onClick={() => setIsPackageModalOpen(true)}>
                <Package className="w-4 h-4 mr-2" />
                Create Package
              </Button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-marble-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">UID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">THC/CBD</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-marble transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-charcoal">{pkg.uid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal">{pkg.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate">{pkg.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate">{pkg.quantity} {pkg.unit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate">{pkg.thc}% / {pkg.cbd}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pkg.status === 'active' ? 'bg-green-100 text-green-800' :
                            pkg.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {pkg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate">
                          <button className="text-gold hover:text-gold-dark">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'manifests' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-charcoal">Transfer Manifests</h2>
              <Button onClick={() => setIsManifestModalOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Create Manifest
              </Button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-marble-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Manifest #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Origin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Packages</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockManifests.map((manifest) => (
                      <tr key={manifest.id} className="hover:bg-marble transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-charcoal">{manifest.manifestNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate">{manifest.origin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate">{manifest.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate">{manifest.packages}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            manifest.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            manifest.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                            manifest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {manifest.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-gold hover:text-gold-dark mr-3">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-charcoal">Lab Tests & COAs</h2>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload COA
              </Button>
            </div>

            <Card className="p-12 text-center">
              <Upload className="w-16 h-16 text-slate mx-auto mb-4 opacity-50" />
              <p className="text-slate">Upload lab test results and Certificates of Analysis</p>
              <Button variant="outline" className="mt-4">Browse Files</Button>
            </Card>
          </div>
        )}

        {/* Create Package Modal */}
        <Modal isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} title="Create METRC Package">
          <form className="space-y-4">
            <Input label="Package UID" placeholder="1A4FF0300000022000001" required />
            <Input label="Product Name" placeholder="OG Kush - Flower" required />
            <Select label="Product Type" required>
              <option value="">Select type...</option>
              <option value="Flower">Flower</option>
              <option value="Concentrate">Concentrate</option>
              <option value="Edible">Edible</option>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity" type="number" placeholder="100" required />
              <Select label="Unit" required>
                <option value="grams">Grams</option>
                <option value="ounces">Ounces</option>
                <option value="pounds">Pounds</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="THC %" type="number" step="0.1" placeholder="24.3" />
              <Input label="CBD %" type="number" step="0.1" placeholder="0.5" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsPackageModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Package</Button>
            </div>
          </form>
        </Modal>

        {/* Create Manifest Modal */}
        <Modal isOpen={isManifestModalOpen} onClose={() => setIsManifestModalOpen(false)} title="Create Transfer Manifest">
          <form className="space-y-4">
            <Input label="Origin Facility" placeholder="Cultivation Facility A" required />
            <Input label="Destination Facility" placeholder="Processing Facility B" required />
            <Input label="Destination License #" placeholder="OCM-PROC-00-000001" required />
            <Input label="Driver Name" placeholder="John Driver" required />
            <Input label="Vehicle License Plate" placeholder="NY-12345" required />
            <Input label="Estimated Departure" type="datetime-local" required />
            <Input label="Estimated Arrival" type="datetime-local" required />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsManifestModalOpen(false)}>Cancel</Button>
              <Button type="submit">Generate Manifest</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
