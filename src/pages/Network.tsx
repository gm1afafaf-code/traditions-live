import { useState, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import { LuxuryCard, GoldButton, AnimatedCounter } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import {
  Leaf,
  MapPin,
  Factory,
  Store,
  ArrowRight,
  Search,
  Zap,
  Globe,
  TrendingUp,
  Shield,
  Link as LinkIcon
} from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'cultivator' | 'processor' | 'retailer';
  location: string;
  volume: number;
  connections: number;
  lat: number;
  lng: number;
}

const networkNodes: NetworkNode[] = [
  { id: '1', name: 'Green Valley Farms', type: 'cultivator', location: 'Hudson Valley', volume: 2400, connections: 45, lat: 41.5, lng: -73.9 },
  { id: '2', name: 'Empire Cannabis Co', type: 'processor', location: 'Brooklyn', volume: 1800, connections: 62, lat: 40.7, lng: -73.9 },
  { id: '3', name: 'Upstate Growers', type: 'cultivator', location: 'Syracuse', volume: 3200, connections: 38, lat: 43.0, lng: -76.1 },
  { id: '4', name: 'Hudson Botanicals', type: 'processor', location: 'Albany', volume: 1500, connections: 41, lat: 42.6, lng: -73.7 },
  { id: '5', name: 'Brooklyn Buds', type: 'retailer', location: 'Brooklyn', volume: 890, connections: 28, lat: 40.6, lng: -73.9 },
  { id: '6', name: 'Manhattan Green', type: 'retailer', location: 'Manhattan', volume: 1200, connections: 35, lat: 40.8, lng: -74.0 },
  { id: '7', name: 'Buffalo Botanics', type: 'cultivator', location: 'Buffalo', volume: 2100, connections: 32, lat: 42.9, lng: -78.8 },
  { id: '8', name: 'Queens Cannabis', type: 'retailer', location: 'Queens', volume: 950, connections: 29, lat: 40.7, lng: -73.8 },
];

const networkStats = [
  { label: 'Cultivators', value: 340, icon: Leaf, color: 'from-green-600 to-green-800' },
  { label: 'Processors', value: 180, icon: Factory, color: 'from-blue-600 to-blue-800' },
  { label: 'Retailers', value: 320, icon: Store, color: 'from-purple-600 to-purple-800' },
  { label: 'Total Volume', value: 24, suffix: 'M', prefix: '$', icon: TrendingUp, color: 'from-gold to-gold-dark' },
];

function NetworkGlobe() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
      
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.1}
            wireframe
          />
        </mesh>
        
        {networkNodes.map((node) => {
          const phi = (90 - node.lat) * (Math.PI / 180);
          const theta = (node.lng + 180) * (Math.PI / 180);
          const x = -2.1 * Math.sin(phi) * Math.cos(theta);
          const y = 2.1 * Math.cos(phi);
          const z = 2.1 * Math.sin(phi) * Math.sin(theta);
          
          return (
            <mesh key={node.id} position={[x, y, z]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={node.type === 'cultivator' ? '#22c55e' : node.type === 'processor' ? '#3b82f6' : '#a855f7'}
                emissive={node.type === 'cultivator' ? '#22c55e' : node.type === 'processor' ? '#3b82f6' : '#a855f7'}
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </Float>
      
      <Sparkles count={200} scale={8} size={2} speed={0.3} color="#d4af37" opacity={0.4} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

function NetworkMap({ nodes, selectedType }: { nodes: NetworkNode[]; selectedType: string | null }) {
  const filteredNodes = useMemo(() => {
    if (!selectedType) return nodes;
    return nodes.filter(n => n.type === selectedType);
  }, [nodes, selectedType]);

  return (
    <div className="relative w-full h-[500px] bg-obsidian/50 rounded-lg overflow-hidden">
      {/* Simplified NY State Map Background */}
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-20">
        <path
          d="M50,150 L80,100 L120,80 L180,70 L250,60 L300,80 L350,100 L380,150 L370,200 L320,230 L250,250 L180,240 L120,220 L70,200 Z"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2"
        />
      </svg>

      {/* Network Nodes */}
      {filteredNodes.map((node, index) => {
        const x = ((node.lng + 80) / 10) * 100;
        const y = ((45 - node.lat) / 8) * 100;
        
        return (
          <motion.div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.2 }}
          >
            <div className={`w-4 h-4 rounded-full ${
              node.type === 'cultivator' ? 'bg-green-500' :
              node.type === 'processor' ? 'bg-blue-500' : 'bg-purple-500'
            } animate-pulse shadow-lg`} />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-obsidian border border-gold/30 rounded-lg p-3 min-w-[180px] shadow-xl">
                <p className="text-white font-semibold text-sm">{node.name}</p>
                <p className="text-gold/60 text-xs capitalize">{node.type}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-white/50">Volume:</span>
                  <span className="text-gold">${node.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Connections:</span>
                  <span className="text-gold">{node.connections}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {filteredNodes.slice(0, 5).map((node, i) => {
          const nextNode = filteredNodes[(i + 1) % filteredNodes.length];
          const x1 = ((node.lng + 80) / 10) * 100;
          const y1 = ((45 - node.lat) / 8) * 100;
          const x2 = ((nextNode.lng + 80) / 10) * 100;
          const y2 = ((45 - nextNode.lat) / 8) * 100;
          
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#d4af37"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.2, duration: 1 }}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4">
        {[
          { type: 'cultivator', color: 'bg-green-500', label: 'Cultivators' },
          { type: 'processor', color: 'bg-blue-500', label: 'Processors' },
          { type: 'retailer', color: 'bg-purple-500', label: 'Retailers' },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-white/60 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Network() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'globe'>('map');

  const filteredNodes = useMemo(() => {
    let nodes = networkNodes;
    if (selectedType) {
      nodes = nodes.filter(n => n.type === selectedType);
    }
    if (searchTerm) {
      nodes = nodes.filter(n => 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return nodes;
  }, [selectedType, searchTerm]);

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
              <Link to="/network" className="text-gold text-sm tracking-wider">Network</Link>
              <Link to="/tracking" className="nav-link text-sm tracking-wider">Tracking</Link>
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
              <Globe className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm uppercase tracking-wider">Live Network</span>
            </div>
            <h1 className="serif text-5xl md:text-6xl font-semibold text-white mb-6">
              Partner <span className="text-gold">Network</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Real-time connections to 840+ licensed partners across New York State. 
              Gold-vein connections reveal escrow-secured collaboration tools.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {networkStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryCard variant="glass" className="text-center py-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl md:text-4xl font-light text-gold mb-1">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix ? stat.suffix + '+' : '+'} 
                      duration={2} 
                    />
                  </p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</p>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <LuxuryCard variant="elevated">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Interactive Network Map</h3>
                <p className="text-white/50 text-sm">Click nodes to view partner details</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search partners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-obsidian/50 border border-gold/20 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-2 rounded text-sm ${viewMode === 'map' ? 'bg-gold text-void' : 'bg-obsidian text-white/60'}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('globe')}
                    className={`px-3 py-2 rounded text-sm ${viewMode === 'globe' ? 'bg-gold text-void' : 'bg-obsidian text-white/60'}`}
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  !selectedType ? 'bg-gold text-void' : 'bg-obsidian border border-gold/20 text-white/60 hover:border-gold/40'
                }`}
              >
                All Partners
              </button>
              {['cultivator', 'processor', 'retailer'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
                    selectedType === type ? 'bg-gold text-void' : 'bg-obsidian border border-gold/20 text-white/60 hover:border-gold/40'
                  }`}
                >
                  {type}s
                </button>
              ))}
            </div>

            {/* Map or Globe View */}
            {viewMode === 'map' ? (
              <NetworkMap nodes={filteredNodes} selectedType={selectedType} />
            ) : (
              <div className="h-[500px] bg-obsidian/50 rounded-lg overflow-hidden">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Globe className="w-20 h-20 text-gold/30 animate-pulse" />
                  </div>
                }>
                  <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                    <NetworkGlobe />
                  </Canvas>
                </Suspense>
              </div>
            )}
          </LuxuryCard>
        </div>
      </section>

      {/* Partner List */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <LuxuryCard variant="elevated">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Featured Partners</h3>
                  <p className="text-white/50 text-sm">Top performing network members</p>
                </div>
                <GoldButton variant="secondary" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </GoldButton>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredNodes.slice(0, 8).map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="p-4 bg-obsidian/50 rounded-lg border border-gold/10 hover:border-gold/30 transition cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          node.type === 'cultivator' ? 'bg-green-500/20' :
                          node.type === 'processor' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                        }`}>
                          {node.type === 'cultivator' && <Leaf className="w-5 h-5 text-green-400" />}
                          {node.type === 'processor' && <Factory className="w-5 h-5 text-blue-400" />}
                          {node.type === 'retailer' && <Store className="w-5 h-5 text-purple-400" />}
                        </div>
                        <span className="text-xs text-gold/60 uppercase">{node.type}</span>
                      </div>
                      <h4 className="text-white font-medium mb-1 group-hover:text-gold transition">{node.name}</h4>
                      <p className="text-white/40 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {node.location}
                      </p>
                      <div className="flex justify-between mt-3 pt-3 border-t border-gold/10 text-xs">
                        <span className="text-white/40">Volume: <span className="text-gold">${node.volume.toLocaleString()}</span></span>
                        <span className="text-white/40 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          {node.connections}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </LuxuryCard>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Tools */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Escrow-Secured</p>
            <h2 className="serif text-4xl md:text-5xl font-semibold text-white">Collaboration Tools</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure Escrow', desc: 'Multi-signature escrow protects all transactions between partners.' },
              { icon: Zap, title: 'Instant Connect', desc: 'One-click partnership requests with automated compliance verification.' },
              { icon: TrendingUp, title: 'Volume Analytics', desc: 'Real-time trading volume and performance metrics for all partners.' },
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
