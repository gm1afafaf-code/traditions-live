import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { LuxuryCard, GoldButton, AnimatedCounter } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import {
  Leaf,
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  FileText,
  ArrowRight,
  RefreshCw,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'in_transit' | 'delivered' | 'pending' | 'delayed';
  eta: string;
  progress: number;
  carrier: string;
  manifestId: string;
  items: number;
  value: number;
}

const shipments: Shipment[] = [
  { id: 'SHP-001', origin: 'Hudson Valley', destination: 'Brooklyn', status: 'in_transit', eta: '2h 15m', progress: 65, carrier: 'Empire Logistics', manifestId: 'MAN-2025-001', items: 24, value: 48000 },
  { id: 'SHP-002', origin: 'Syracuse', destination: 'Manhattan', status: 'delivered', eta: 'Delivered', progress: 100, carrier: 'Green Route', manifestId: 'MAN-2025-002', items: 18, value: 36000 },
  { id: 'SHP-003', origin: 'Buffalo', destination: 'Queens', status: 'pending', eta: '4h 30m', progress: 0, carrier: 'NY Cannabis Transit', manifestId: 'MAN-2025-003', items: 32, value: 64000 },
  { id: 'SHP-004', origin: 'Albany', destination: 'Bronx', status: 'delayed', eta: '6h 45m', progress: 35, carrier: 'Empire Logistics', manifestId: 'MAN-2025-004', items: 15, value: 30000 },
  { id: 'SHP-005', origin: 'Rochester', destination: 'Staten Island', status: 'in_transit', eta: '3h 20m', progress: 45, carrier: 'Green Route', manifestId: 'MAN-2025-005', items: 28, value: 56000 },
];

const deliveryStats = [
  { label: 'Active Shipments', value: 47, icon: Truck },
  { label: 'On-Time Rate', value: 98.5, suffix: '%', icon: Clock },
  { label: 'Delivered Today', value: 23, icon: CheckCircle },
  { label: 'Total Value', value: 1.2, prefix: '$', suffix: 'M', icon: TrendingUp },
];

const etaData = [
  { time: '6AM', deliveries: 3 },
  { time: '8AM', deliveries: 8 },
  { time: '10AM', deliveries: 12 },
  { time: '12PM', deliveries: 15 },
  { time: '2PM', deliveries: 18 },
  { time: '4PM', deliveries: 14 },
  { time: '6PM', deliveries: 9 },
  { time: '8PM', deliveries: 5 },
];

const timelineEvents = [
  { time: '14:32', event: 'Package scanned at Brooklyn distribution center', status: 'complete' },
  { time: '12:15', event: 'In transit - Highway I-87 South', status: 'complete' },
  { time: '10:45', event: 'Departed Hudson Valley facility', status: 'complete' },
  { time: '09:30', event: 'Manifest verified and sealed', status: 'complete' },
  { time: '09:00', event: 'Order picked and packed', status: 'complete' },
  { time: '08:30', event: 'Order confirmed', status: 'complete' },
];

function ShipmentHeatmap() {
  const heatmapData = [
    { x: 20, y: 30, intensity: 0.8 },
    { x: 35, y: 45, intensity: 0.6 },
    { x: 50, y: 25, intensity: 0.9 },
    { x: 65, y: 55, intensity: 0.7 },
    { x: 80, y: 40, intensity: 0.5 },
    { x: 25, y: 60, intensity: 0.4 },
    { x: 70, y: 70, intensity: 0.6 },
  ];

  return (
    <div className="relative w-full h-[400px] bg-obsidian/50 rounded-lg overflow-hidden">
      {/* NY State Outline */}
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-30">
        <path
          d="M50,150 L80,100 L120,80 L180,70 L250,60 L300,80 L350,100 L380,150 L370,200 L320,230 L250,250 L180,240 L120,220 L70,200 Z"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2"
        />
      </svg>

      {/* Heatmap Points */}
      {heatmapData.map((point, i) => (
        <motion.div
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div
            className="rounded-full animate-pulse"
            style={{
              width: `${40 + point.intensity * 40}px`,
              height: `${40 + point.intensity * 40}px`,
              background: `radial-gradient(circle, rgba(212, 175, 55, ${point.intensity}) 0%, rgba(212, 175, 55, 0) 70%)`,
            }}
          />
        </motion.div>
      ))}

      {/* Active Truck Icons */}
      {shipments.filter(s => s.status === 'in_transit').slice(0, 3).map((shipment, i) => (
        <motion.div
          key={shipment.id}
          className="absolute"
          style={{ left: `${30 + i * 20}%`, top: `${40 + i * 10}%` }}
          animate={{
            x: [0, 10, 0],
            y: [0, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-gold">
            <Truck className="w-4 h-4 text-void" />
          </div>
        </motion.div>
      ))}

      {/* Route Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d="M 80 150 Q 150 100 220 120 T 350 140"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
          <span className="text-white/60">High Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3 h-3 text-gold" />
          <span className="text-white/60">Active Shipment</span>
        </div>
      </div>
    </div>
  );
}

function ShipmentTimeline({ events }: { events: typeof timelineEvents }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gold/30" />
      {events.map((event, index) => (
        <motion.div
          key={index}
          className="relative pb-6 last:pb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="absolute left-[-29px] w-6 h-6 rounded-full bg-obsidian border-2 border-gold flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-gold" />
          </div>
          <div className="bg-obsidian/50 rounded-lg p-4 border border-gold/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gold text-sm font-medium">{event.time}</span>
              <span className="text-xs text-green-400 uppercase">Complete</span>
            </div>
            <p className="text-white/80 text-sm">{event.event}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Tracking() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(shipments[0]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredShipments = filterStatus 
    ? shipments.filter(s => s.status === filterStatus)
    : shipments;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'in_transit': return 'bg-gold/20 text-gold';
      case 'pending': return 'bg-blue-500/20 text-blue-400';
      case 'delayed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in_transit': return Truck;
      case 'pending': return Clock;
      case 'delayed': return AlertTriangle;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen luxury-bg gold-veins">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-void/80 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={ROUTES.HOME} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Leaf className="w-5 h-5 text-void" />
              </div>
              <span className="serif text-2xl font-semibold text-white tracking-wider">
                <span className="text-gold">V</span>OUCHED
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to={ROUTES.VAULT} className="nav-link text-sm tracking-wider">Marketplace</Link>
              <Link to="/compliance" className="nav-link text-sm tracking-wider">Compliance</Link>
              <Link to="/network" className="nav-link text-sm tracking-wider">Network</Link>
              <Link to="/tracking" className="text-gold text-sm tracking-wider">Tracking</Link>
            </div>

            <Link to={ROUTES.LOGIN}>
              <GoldButton variant="outline" size="sm">
                Enter Platform
              </GoldButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-6">
              <Navigation className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm uppercase tracking-wider">Live Tracking</span>
            </div>
            <h1 className="serif text-5xl md:text-6xl font-semibold text-white mb-6">
              Shipment <span className="text-gold">Tracking</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Real-time GPS tracking with Grok-forecasted ETAs, Metrc manifests, 
              and proof-of-delivery documentation.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {deliveryStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryCard variant="glass" className="text-center py-6">
                  <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-light text-gold mb-1">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix} 
                      duration={2}
                      decimals={stat.suffix === '%' ? 1 : 0}
                    />
                  </p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</p>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heatmap Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <LuxuryCard variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">GPS Heatmap</h3>
                <p className="text-white/50 text-sm">Real-time shipment activity across New York</p>
              </div>
              <div className="flex gap-3">
                <GoldButton variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </GoldButton>
                <GoldButton variant="secondary" size="sm">
                  <Zap className="w-4 h-4 mr-1" />
                  AI Forecast
                </GoldButton>
              </div>
            </div>
            <ShipmentHeatmap />
          </LuxuryCard>
        </div>
      </section>

      {/* Shipments & Timeline */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipment List */}
            <div className="lg:col-span-2">
              <LuxuryCard variant="elevated">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Active Shipments</h3>
                    <p className="text-white/50 text-sm">Click to view details</p>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'in_transit', 'delivered', 'pending', 'delayed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status === 'all' ? null : status)}
                        className={`px-3 py-1 text-xs rounded capitalize ${
                          (status === 'all' && !filterStatus) || filterStatus === status
                            ? 'bg-gold text-void'
                            : 'bg-obsidian text-white/60 hover:text-white'
                        }`}
                      >
                        {status === 'all' ? 'All' : status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredShipments.map((shipment, index) => {
                    const StatusIcon = getStatusIcon(shipment.status);
                    return (
                      <motion.div
                        key={shipment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedShipment(shipment)}
                        className={`p-4 rounded-lg border cursor-pointer transition ${
                          selectedShipment?.id === shipment.id
                            ? 'bg-gold/10 border-gold/40'
                            : 'bg-obsidian/50 border-gold/10 hover:border-gold/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                              <Truck className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{shipment.id}</p>
                              <p className="text-white/40 text-xs">{shipment.carrier}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase ${getStatusColor(shipment.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {shipment.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                          <MapPin className="w-4 h-4 text-gold/60" />
                          <span>{shipment.origin}</span>
                          <ArrowRight className="w-4 h-4" />
                          <span>{shipment.destination}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 bg-obsidian rounded-full overflow-hidden mb-3">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dark to-gold rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${shipment.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>

                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">ETA: <span className="text-gold">{shipment.eta}</span></span>
                          <span className="text-white/40">{shipment.items} items | ${shipment.value.toLocaleString()}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </LuxuryCard>
            </div>

            {/* Timeline */}
            <div>
              <LuxuryCard variant="elevated" className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Shipment Timeline</h3>
                    <p className="text-white/50 text-sm">{selectedShipment?.id || 'Select a shipment'}</p>
                  </div>
                  <GoldButton variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Manifest
                  </GoldButton>
                </div>

                {selectedShipment ? (
                  <ShipmentTimeline events={timelineEvents} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="w-16 h-16 text-gold/30 mb-4" />
                    <p className="text-white/50">Select a shipment to view timeline</p>
                  </div>
                )}
              </LuxuryCard>
            </div>
          </div>
        </div>
      </section>

      {/* ETA Predictions Chart */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <LuxuryCard variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Delivery Forecast</h3>
                <p className="text-white/50 text-sm">Grok-powered ETA predictions for today</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gold">
                <Zap className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={etaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121212',
                      border: '1px solid #d4af37',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    stroke="#d4af37"
                    strokeWidth={3}
                    dot={{ fill: '#d4af37', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#f4d03f' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </LuxuryCard>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Advanced Features</p>
            <h2 className="serif text-4xl md:text-5xl font-semibold text-white">Tracking Intelligence</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Navigation, title: 'GPS Heatmap', desc: 'Real-time visualization of all active shipments across New York State.' },
              { icon: Zap, title: 'AI Forecasting', desc: 'Grok-powered ETA predictions with 98% accuracy for delivery planning.' },
              { icon: Shield, title: 'Metrc Integration', desc: 'Auto-generated manifests and proof-of-delivery for compliance.' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryCard variant="glass" className="text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60">{feature.desc}</p>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Leaf className="w-4 h-4 text-void" />
              </div>
              <span className="serif text-xl font-semibold text-white">
                <span className="text-gold">V</span>OUCHED
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/40">
              <a href="#" className="hover:text-gold transition">Terms</a>
              <a href="#" className="hover:text-gold transition">Privacy</a>
              <a href="#" className="hover:text-gold transition">Contact</a>
              <span>© 2025 VOUCHED. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
