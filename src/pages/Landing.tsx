import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Environment, OrbitControls } from '@react-three/drei';
import { ROUTES } from '@/lib/constants';
import { AnimatedCounter, GoldButton, LuxuryCard } from '@/components/ui';
import { 
  Leaf, 
  Shield, 
  TrendingUp, 
  Users, 
  Package, 
  MapPin,
  ArrowRight,
  Zap,
  Lock,
  Globe
} from 'lucide-react';

function GoldOrb({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.1}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f4d03f" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#d4af37" />
      
      <GoldOrb position={[0, 0, 0]} scale={2} />
      <GoldOrb position={[-5, 2, -3]} scale={0.8} />
      <GoldOrb position={[5, -1, -2]} scale={0.6} />
      <GoldOrb position={[3, 3, -4]} scale={0.5} />
      <GoldOrb position={[-3, -2, -3]} scale={0.4} />
      
      <Sparkles count={300} scale={20} size={3} speed={0.5} color="#d4af37" opacity={0.6} />
      
      <Environment preset="night" />
      <fog attach="fog" args={['#0a0a0a', 5, 25]} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

function FloatingLeaves() {
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 10,
    size: 16 + Math.random() * 16,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-gold"
          style={{ left: leaf.left, top: '-50px' }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 720],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Leaf size={leaf.size} style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }} />
        </motion.div>
      ))}
    </div>
  );
}

function CurtainAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #121212 100%)' }}
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 1.5, delay: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="serif text-8xl font-bold tracking-[0.15em] text-white">
          <span className="text-gold gold-glow">V</span>OUCHED
        </h1>
        <p className="text-gold/60 tracking-[0.3em] mt-4 text-sm uppercase">Entering the Vault</p>
      </motion.div>
    </motion.div>
  );
}

const stats = [
  { value: 847, label: 'Licensed Vendors', suffix: '+', icon: Users },
  { value: 12400, label: 'Active SKUs', suffix: '+', icon: Package },
  { value: 24, label: 'Volume Traded', prefix: '$', suffix: 'M', icon: TrendingUp },
  { value: 340, label: 'Cultivators', suffix: '+', icon: Leaf },
];

const features = [
  {
    icon: Shield,
    title: 'Compliance Fortress',
    description: 'Real-time NYS OCM adherence tracking with AI-powered auto-audits and instant anomaly detection.',
  },
  {
    icon: Zap,
    title: 'AI Marketplace',
    description: 'Gemini-powered strain matching, dynamic pricing optimization, and predictive inventory management.',
  },
  {
    icon: Lock,
    title: 'Escrow Security',
    description: 'Bank-grade transaction security with multi-signature escrow and instant settlement protocols.',
  },
  {
    icon: Globe,
    title: 'Live Network',
    description: 'Real-time connections to 340+ cultivators, 180+ processors, and 320+ retailers across New York.',
  },
];

const strains = [
  { name: 'Blue Dream', thc: 24, price: 2800, type: 'Hybrid' },
  { name: 'Purple Punch', thc: 22, price: 3200, type: 'Indica' },
  { name: 'Sour Diesel', thc: 26, price: 2600, type: 'Sativa' },
  { name: 'OG Kush', thc: 25, price: 3000, type: 'Hybrid' },
];

export function Landing() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [activeStrain, setActiveStrain] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStrain((prev) => (prev + 1) % strains.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen luxury-bg gold-veins overflow-x-hidden">
      <AnimatePresence>
        {showCurtain && <CurtainAnimation onComplete={() => setShowCurtain(false)} />}
      </AnimatePresence>

      <FloatingLeaves />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <Link to="/tracking" className="nav-link text-sm tracking-wider">Tracking</Link>
          </div>

          <Link to={ROUTES.LOGIN}>
            <GoldButton variant="outline" size="sm">
              Enter Platform
            </GoldButton>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
              <HeroScene />
            </Canvas>
          </Suspense>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <motion.p
            className="ens-causa text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.5 }}
          >
            Ens Causa Sui
          </motion.p>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.9, duration: 0.8 }}
          >
            <div className="inline-block px-16 pt-6 pb-8 border border-gold/30 bg-obsidian/30 backdrop-blur-sm">
              <h1 className="serif text-8xl md:text-9xl font-bold tracking-[0.12em] text-white illuminated leading-tight">
                <span className="text-gold gold-glow">V</span>OUCHED
              </h1>
              <p className="text-sm tracking-[0.5em] text-white/60 mt-4">N E W &nbsp; Y O R K</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.1, duration: 0.5 }}
          >
            <p className="text-gold uppercase tracking-[0.25em] text-sm mb-2">The Platform</p>
            <p className="text-3xl md:text-4xl text-white/80 font-light tracking-widest serif italic">
              Premium Cannabis Wholesale
            </p>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.5 }}
          >
            <Link to={ROUTES.LOGIN}>
              <GoldButton size="xl" className="min-w-[200px]">
                Enter Vault
                <ArrowRight className="ml-2 w-5 h-5 inline" />
              </GoldButton>
            </Link>
            <Link to={ROUTES.VAULT}>
              <GoldButton variant="secondary" size="xl" className="min-w-[200px]">
                Browse Inventory
              </GoldButton>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 4, duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <LuxuryCard key={stat.label} variant="glass" className="text-center py-8" glow={index === 0}>
                <stat.icon className="w-8 h-8 text-gold mx-auto mb-4" />
                <p className="text-4xl md:text-5xl font-light text-gold mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={2.5}
                  />
                </p>
                <p className="text-xs text-white/60 uppercase tracking-[0.2em]">{stat.label}</p>
              </LuxuryCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Strains Carousel */}
      <section className="relative z-20 py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Live Inventory</p>
            <h2 className="serif text-5xl md:text-6xl font-semibold text-white">Featured Strains</h2>
          </motion.div>

          <div className="relative">
            <div className="flex justify-center gap-6 overflow-hidden">
              {strains.map((strain, index) => (
                <motion.div
                  key={strain.name}
                  className={`flex-shrink-0 w-72 transition-all duration-500 ${
                    index === activeStrain ? 'scale-110 z-10' : 'scale-90 opacity-50'
                  }`}
                  animate={{
                    x: (index - activeStrain) * 100,
                  }}
                >
                  <LuxuryCard variant="elevated" className="text-center" glow={index === activeStrain}>
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
                      <Leaf className="w-12 h-12 text-gold" />
                    </div>
                    <span className="text-xs text-gold/60 uppercase tracking-wider">{strain.type}</span>
                    <h3 className="text-2xl font-semibold text-white mt-2 mb-4">{strain.name}</h3>
                    <div className="flex justify-between items-center border-t border-gold/20 pt-4 mt-4">
                      <div>
                        <p className="text-xs text-white/40 uppercase">THC</p>
                        <p className="text-gold text-lg">{strain.thc}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase">Price/lb</p>
                        <p className="text-gold text-lg">${strain.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </LuxuryCard>
                </motion.div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {strains.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStrain(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeStrain ? 'bg-gold w-8' : 'bg-gold/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Platform Capabilities</p>
            <h2 className="serif text-5xl md:text-6xl font-semibold text-white">Built for Excellence</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryCard variant="glass" className="h-full">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-white/60 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Preview */}
      <section className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Our Network</p>
            <h2 className="serif text-5xl md:text-6xl font-semibold text-white mb-6">Who We Serve</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              We partner exclusively with the best in the industry. If you're{' '}
              <span className="serif italic text-gold">VOUCHED</span>, you've been{' '}
              <span className="text-white font-semibold">vetted for integrity, quality, and compliance</span>.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Cultivators', count: '340+', desc: 'Premium flower producers with full COA documentation' },
              { icon: Package, title: 'Processors', count: '180+', desc: 'Licensed extraction and manufacturing partners' },
              { icon: MapPin, title: 'Retailers', count: '320+', desc: 'Verified dispensaries across New York State' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <LuxuryCard variant="bordered" className="text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-gold" />
                  </div>
                  <p className="text-4xl font-light text-gold mb-2">{item.count}</p>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <LuxuryCard variant="elevated" className="py-16 px-8" glow>
              <h2 className="serif text-4xl md:text-5xl font-semibold text-white mb-6">
                Ready to Enter the Vault?
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                Join New York's premier cannabis wholesale network. Apply for verification today.
              </p>
              <Link to={ROUTES.LOGIN}>
                <GoldButton size="xl">
                  Apply for Access
                  <ArrowRight className="ml-2 w-5 h-5 inline" />
                </GoldButton>
              </Link>
            </LuxuryCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 px-4 border-t border-gold/10">
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
