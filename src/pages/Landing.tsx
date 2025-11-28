import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

export function Landing() {
  return (
    <div className="min-h-screen bg-marble">
      {/* Hero Section */}
      <section className="flex items-center justify-center relative overflow-hidden pt-24 pb-12">
        <div className="energy-orb" style={{ top: '15%', right: '10%' }} />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="ens-causa text-xl mb-6">Ens Causa Sui</p>
          <div className="mb-6">
            <div className="inline-block px-12 pt-4 pb-5 border-2 border-gold/40">
              <h1 className="serif text-9xl font-bold tracking-[0.08em] text-charcoal illuminated leading-tight">
                <span className="text-gold" style={{ textShadow: '0 0 15px rgba(184, 163, 105, 0.5)' }}>V</span>OUCHED
              </h1>
              <p className="text-sm tracking-[0.4em] text-charcoal mt-2">N E W &nbsp; Y O R K</p>
            </div>
          </div>
          <p className="text-sm text-gold uppercase tracking-[0.2em]">The Platform</p>
          <p className="text-3xl text-slate font-light tracking-widest mt-2 serif italic">
            Premium Wholesale Platform
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 text-center">
        <div className="grid grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          <Card className="stat-card">
            <p className="text-5xl font-light text-gold mb-1">12,788</p>
            <p className="text-xs text-slate uppercase tracking-[0.15em]">Lbs Traded</p>
          </Card>
          <Card className="stat-card">
            <p className="text-5xl font-light text-gold mb-1">2,330</p>
            <p className="text-xs text-slate uppercase tracking-[0.15em]">Active Listings</p>
          </Card>
          <Card className="stat-card">
            <p className="text-5xl font-light text-gold mb-1">484</p>
            <p className="text-xs text-slate uppercase tracking-[0.15em]">Vendors</p>
          </Card>
        </div>

        <Link to={ROUTES.LOGIN}>
          <Button variant="primary" size="lg" className="px-32 py-6 text-4xl serif tracking-[0.15em]">
            ENTER
          </Button>
        </Link>
      </section>

      {/* Network Section */}
      <section className="py-20 px-4 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gold uppercase tracking-[0.2em] mb-2">Our Network</p>
            <h2 className="serif text-6xl font-semibold text-charcoal">Who We Serve</h2>
          </div>

          <div className="max-w-3xl mx-auto mb-12 text-center">
            <p className="text-slate text-lg leading-relaxed">
              We partner exclusively with the best in the industry. If you're{' '}
              <span className="serif italic text-charcoal font-semibold">VOUCHED</span>, you've been{' '}
              <span className="text-charcoal font-semibold">vetted for integrity, quality, and compliance</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="w-12 h-12 mb-5 rounded-full bg-white flex items-center justify-center border border-black/5">
                <span className="text-gold text-xl">🌱</span>
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Cultivators</h3>
              <p className="text-slate text-sm leading-relaxed">
                Reach verified distributors and processors statewide. Premium inventory with full COA documentation.
              </p>
            </Card>
            <Card>
              <div className="w-12 h-12 mb-5 rounded-full bg-white flex items-center justify-center border border-black/5">
                <span className="text-gold text-xl">⚙️</span>
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Processors</h3>
              <p className="text-slate text-sm leading-relaxed">
                Source quality flower for processing. Connect with reliable wholesale partners across the network.
              </p>
            </Card>
            <Card>
              <div className="w-12 h-12 mb-5 rounded-full bg-white flex items-center justify-center border border-black/5">
                <span className="text-gold text-xl">📦</span>
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Distributors & Brands</h3>
              <p className="text-slate text-sm leading-relaxed">
                Scale your business with direct access to cultivators and processors. Real-time inventory management.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gold/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-slate">
            <a href="#" className="hover:text-charcoal transition">Terms</a>
            <span className="text-gold/30">|</span>
            <a href="#" className="hover:text-charcoal transition">Privacy</a>
            <span className="text-gold/30">|</span>
            <a href="#" className="hover:text-charcoal transition">Contact</a>
            <span className="text-gold/30">|</span>
            <p className="text-xs text-slate/60">© 2025 VOUCHED. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .stat-card { transition: all 0.3s ease; cursor: default; }
        .stat-card:hover { box-shadow: 0 0 40px rgba(255,255,255,0.6), 0 10px 40px rgba(0,0,0,0.05); transform: translateY(-4px); }
        .illuminated { text-shadow: 0 0 60px rgba(255,255,255,0.9); }
        .ens-causa { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; color: #b8a369; }
        .energy-orb {
          position: absolute; width: 150px; height: 150px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(212, 197, 160, 0.9), rgba(184, 163, 105, 0.5));
          box-shadow: 0 0 80px rgba(212, 197, 160, 1);
          animation: orbFloat 12s ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, -50px); }
        }
      `}</style>
    </div>
  );
}
