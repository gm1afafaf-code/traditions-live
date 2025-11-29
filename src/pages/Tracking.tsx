import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingUp,
  Menu,
  X
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
    <div className="relative w-full h-64 sm:h-80 md:h-[400px] bg-obsidian/50 rounded-lg overflow-hidden">
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
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex flex-wrap gap-2 sm:gap-4 text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gold animate-pulse" />
          <span className="text-white/60">High Activity</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-void" />
              </div>
              <span className="serif text-xl sm:text-2xl font-semibold text-white tracking-wider">
                <span className="text-gold">V</span>OUCHED
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to={ROUTES.VAULT} className="nav-link text-sm tracking-wider">Marketplace</Link>
              <Link to="/compliance" className="nav-link text-sm tracking-wider">Compliance</Link>
              <Link to="/network" className="nav-link text-sm tracking-wider">Network</Link>
              <Link to="/tracking" className="text-gold text-sm tracking-wider">Tracking</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to={ROUTES.LOGIN} className="hidden sm:block">
                <GoldButton variant="outline" size="sm">
                  Enter Platform
                </GoldButton>
              </Link>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 bg-obsidian/95 backdrop-blur-xl border border-gold/20 rounded-xl overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <Link to={ROUTES.VAULT} className="block py-2 px-4 text-white/80 hover:text-gold hover:bg-gold/5 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
                  <Link to="/compliance" className="block py-2 px-4 text-white/80 hover:text-gold hover:bg-gold/5 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>Compliance</Link>
                  <Link to="/network" className="block py-2 px-4 text-white/80 hover:text-gold hover:bg-gold/5 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>Network</Link>
                  <Link to="/tracking" className="block py-2 px-4 text-gold bg-gold/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Tracking</Link>
                  <div className="pt-2 border-t border-gold/10">
                    <Link to={ROUTES.LOGIN} className="block" onClick={() => setMobileMenuOpen(false)}>
                      <GoldButton variant="primary" size="md" className="w-full">
                        Enter Platform
                      </GoldButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gold/10 rounded-full mb-4 sm:mb-6">
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
              <span className="text-gold text-xs sm:text-sm uppercase tracking-wider">Live Tracking</span>
            </div>
            <h1 className="serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 sm:mb-6 px-2">
              Shipment <span className="text-gold">Tracking</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
              Real-time GPS tracking with Grok-forecasted ETAs, Metrc manifests, 
              and proof-of-delivery documentation.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
            {deliveryStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryCard variant="glass" className="text-center py-4 sm:py-5 md:py-6 px-2 sm:px-4">
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gold mx-auto mb-2 sm:mb-3" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gold mb-1">
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
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <LuxuryCard variant="elevated">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">GPS Heatmap</h3>
                <p className="text-white/50 text-xs sm:text-sm">Real-time shipment activity across New York</p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <GoldButton variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </GoldButton>
                <GoldButton variant="secondary" size="sm">
                  <Zap className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">AI Forecast</span>
                  <span className="sm:hidden">AI</span>
                </GoldButton>
              </div>
            </div>
            <ShipmentHeatmap />
          </LuxuryCard>
        </div>
      </section>

      {/* Shipments & Timeline */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Shipment List */}
            <div className="lg:col-span-2">
              <LuxuryCard variant="elevated">
                <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Active Shipments</h3>
                    <p className="text-white/50 text-xs sm:text-sm">Click to view details</p>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {['all', 'in_transit', 'delivered', 'pending', 'delayed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status === 'all' ? null : status)}
                        className={`px-2 sm:px-3 py-1 text-xs rounded capitalize ${
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

                <div className="space-y-3 sm:space-y-4">
                  {filteredShipments.map((shipment, index) => {
                    const StatusIcon = getStatusIcon(shipment.status);
                    return (
                      <motion.div
                        key={shipment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedShipment(shipment)}
                        className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition ${
                          selectedShipment?.id === shipment.id
                            ? 'bg-gold/10 border-gold/40'
                            : 'bg-obsidian/50 border-gold/10 hover:border-gold/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 flex items-center justify-center">
                              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm sm:text-base">{shipment.id}</p>
                              <p className="text-white/40 text-xs">{shipment.carrier}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs uppercase ${getStatusColor(shipment.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="hidden sm:inline">{shipment.status.replace('_', ' ')}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/60 mb-2 sm:mb-3">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gold/60" />
                          <span>{shipment.origin}</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{shipment.destination}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 sm:h-2 bg-obsidian rounded-full overflow-hidden mb-2 sm:mb-3">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Shipment Timeline</h3>
                    <p className="text-white/50 text-xs sm:text-sm">{selectedShipment?.id || 'Select a shipment'}</p>
                  </div>
                  <GoldButton variant="ghost" size="sm">
                    <FileText className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Manifest</span>
                  </GoldButton>
                </div>

                {selectedShipment ? (
                  <ShipmentTimeline events={timelineEvents} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gold/30 mb-3 sm:mb-4" />
                    <p className="text-white/50 text-sm">Select a shipment to view timeline</p>
                  </div>
                )}
              </LuxuryCard>
            </div>
          </div>
        </div>
      </section>

      {/* ETA Predictions Chart */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <LuxuryCard variant="elevated">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Delivery Forecast</h3>
                <p className="text-white/50 text-xs sm:text-sm">Grok-powered ETA predictions for today</p>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gold">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>AI-Powered</span>
              </div>
            </div>
            <div className="h-48 sm:h-56 md:h-64">
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
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4">Advanced Features</p>
            <h2 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">Tracking Intelligence</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gold" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-white/60 text-sm sm:text-base">{feature.desc}</p>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Leaf className="w-4 h-4 text-void" />
              </div>
              <span className="serif text-lg sm:text-xl font-semibold text-white">
                <span className="text-gold">V</span>OUCHED
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/40">
              <a href="#" className="hover:text-gold transition">Terms</a>
              <a href="#" className="hover:text-gold transition">Privacy</a>
              <a href="#" className="hover:text-gold transition">Contact</a>
              <span className="w-full sm:w-auto text-center">© 2025 VOUCHED. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
