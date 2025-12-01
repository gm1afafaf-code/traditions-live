import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { AnimatedCounter } from '@/components/ui';
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
  Globe,
  Menu,
  X
} from 'lucide-react';

function CurtainAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-stone-50"
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 1.2, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="serif text-4xl sm:text-6xl md:text-8xl font-bold tracking-[0.1em] sm:tracking-[0.15em] text-stone-900">
          <span className="text-amber-600">V</span>OUCHED
        </h1>
        <p className="text-amber-600/60 tracking-[0.2em] sm:tracking-[0.3em] mt-3 sm:mt-4 text-xs sm:text-sm uppercase">Premium Cannabis Wholesale</p>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStrain((prev) => (prev + 1) % strains.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      <AnimatePresence>
        {showCurtain && <CurtainAnimation onComplete={() => setShowCurtain(false)} />}
      </AnimatePresence>

      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-stone-50/80 backdrop-blur-md border-b border-amber-200/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="serif text-xl sm:text-2xl font-semibold text-stone-900 tracking-wider">
              <span className="text-amber-600">V</span>OUCHED
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to={ROUTES.VAULT} className="text-stone-600 hover:text-amber-600 transition text-sm tracking-wider font-medium">Marketplace</Link>
            <Link to="/compliance" className="text-stone-600 hover:text-amber-600 transition text-sm tracking-wider font-medium">Compliance</Link>
            <Link to="/network" className="text-stone-600 hover:text-amber-600 transition text-sm tracking-wider font-medium">Network</Link>
            <Link to="/tracking" className="text-stone-600 hover:text-amber-600 transition text-sm tracking-wider font-medium">Tracking</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN} className="hidden sm:block">
              <button className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition shadow-lg shadow-stone-900/20">
                Enter Platform
              </button>
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white border border-amber-200/50 rounded-xl overflow-hidden shadow-xl"
            >
              <div className="p-4 space-y-1">
                <Link to={ROUTES.VAULT} className="block py-3 px-4 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition font-medium" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
                <Link to="/compliance" className="block py-3 px-4 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition font-medium" onClick={() => setMobileMenuOpen(false)}>Compliance</Link>
                <Link to="/network" className="block py-3 px-4 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition font-medium" onClick={() => setMobileMenuOpen(false)}>Network</Link>
                <Link to="/tracking" className="block py-3 px-4 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition font-medium" onClick={() => setMobileMenuOpen(false)}>Tracking</Link>
                <div className="pt-3 border-t border-stone-100">
                  <Link to={ROUTES.LOGIN} className="block" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition">
                      Enter Platform
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.p
            className="text-amber-600 uppercase tracking-[0.3em] text-xs sm:text-sm mb-6 sm:mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            New York's Premier Wholesale Platform
          </motion.p>

          <motion.div
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.4, duration: 0.6 }}
          >
            <h1 className="serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-stone-900 leading-none">
              <span className="text-amber-600">V</span>OUCHED
            </h1>
            <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-400" />
              <p className="text-stone-500 tracking-[0.2em] text-xs sm:text-sm uppercase">Est. 2024</p>
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.5 }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-stone-600 font-light tracking-wide serif">
              Premium Cannabis Wholesale
            </p>
            <p className="text-stone-500 mt-4 max-w-xl mx-auto text-sm sm:text-base">
              The exclusive B2B marketplace connecting licensed cultivators, processors, and retailers across New York State.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.5 }}
          >
            <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition shadow-xl shadow-stone-900/20 flex items-center justify-center gap-2">
                Enter Platform
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to={ROUTES.VAULT} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 font-medium rounded-lg border-2 border-stone-200 hover:border-amber-400 hover:text-amber-600 transition shadow-lg">
                Browse Inventory
              </button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 3.5, duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-stone-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-amber-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4 bg-white border-y border-amber-200/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className={`text-center py-6 sm:py-8 px-4 rounded-2xl ${index === 0 ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50' : 'bg-stone-50 border border-stone-200/50'}`}>
                <stat.icon className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4 ${index === 0 ? 'text-amber-600' : 'text-stone-400'}`} />
                <p className={`text-3xl sm:text-4xl md:text-5xl font-light mb-2 ${index === 0 ? 'text-amber-600' : 'text-stone-900'}`}>
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={2.5}
                  />
                </p>
                <p className="text-xs sm:text-sm text-stone-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-600 uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 font-medium">Live Inventory</p>
            <h2 className="serif text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-900">Featured Strains</h2>
          </motion.div>

          <div className="relative">
            <div className="flex justify-center gap-4 sm:gap-6 overflow-hidden">
              {strains.map((strain, index) => (
                <motion.div
                  key={strain.name}
                  className={`flex-shrink-0 w-64 sm:w-72 transition-all duration-500 ${
                    index === activeStrain ? 'scale-105 z-10' : 'scale-95 opacity-50'
                  }`}
                  animate={{ x: (index - activeStrain) * 80 }}
                >
                  <div className={`bg-white rounded-2xl p-6 text-center shadow-xl border ${index === activeStrain ? 'border-amber-300 shadow-amber-100' : 'border-stone-200'}`}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                      <Leaf className={`w-10 h-10 sm:w-12 sm:h-12 ${index === activeStrain ? 'text-amber-600' : 'text-emerald-600'}`} />
                    </div>
                    <span className="text-xs text-amber-600 uppercase tracking-wider font-medium">{strain.type}</span>
                    <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 mt-2 mb-4">{strain.name}</h3>
                    <div className="flex justify-between items-center border-t border-stone-100 pt-4 mt-4">
                      <div>
                        <p className="text-xs text-stone-400 uppercase">THC</p>
                        <p className="text-amber-600 text-lg font-medium">{strain.thc}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 uppercase">Price/lb</p>
                        <p className="text-amber-600 text-lg font-medium">${strain.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {strains.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStrain(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeStrain ? 'bg-amber-500 w-8' : 'bg-stone-300 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4 bg-white border-y border-amber-200/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-600 uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 font-medium">Platform Capabilities</p>
            <h2 className="serif text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-900">Built for Excellence</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-full p-6 sm:p-8 bg-stone-50 rounded-2xl border border-stone-200/50 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-stone-900 mb-2">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-stone-500 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-600 uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 font-medium">Our Network</p>
            <h2 className="serif text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-900 mb-4">Who We Serve</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base">
              We partner exclusively with the best in the industry. If you are{' '}
              <span className="serif italic text-amber-600">VOUCHED</span>, you have been{' '}
              <span className="text-stone-900 font-semibold">vetted for integrity, quality, and compliance</span>.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
                <div className="text-center h-full p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/50 transition-all">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-light text-amber-600 mb-2">{item.count}</p>
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-stone-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="py-12 sm:py-16 px-6 sm:px-10 bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl shadow-2xl">
              <h2 className="serif text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 sm:mb-6">
                Ready to Enter the Platform?
              </h2>
              <p className="text-stone-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
                Join New York's premier cannabis wholesale network. Apply for verification today.
              </p>
              <Link to={ROUTES.LOGIN}>
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 mx-auto">
                  Apply for Access
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 py-10 sm:py-12 px-4 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="serif text-xl font-semibold text-stone-900">
                <span className="text-amber-600">V</span>OUCHED
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-stone-500">
              <a href="#" className="hover:text-amber-600 transition">Terms</a>
              <a href="#" className="hover:text-amber-600 transition">Privacy</a>
              <a href="#" className="hover:text-amber-600 transition">Contact</a>
              <span className="w-full text-center md:w-auto text-stone-400">2025 VOUCHED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
