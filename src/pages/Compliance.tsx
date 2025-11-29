import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LuxuryCard, GoldButton, AnimatedCounter } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  TrendingUp,
  Download,
  RefreshCw,
  Leaf,
  ArrowRight,
  Eye,
  Lock,
  Zap,
  Award
} from 'lucide-react';

const complianceData = [
  { month: 'Jan', score: 94, audits: 12, issues: 2 },
  { month: 'Feb', score: 96, audits: 15, issues: 1 },
  { month: 'Mar', score: 95, audits: 18, issues: 3 },
  { month: 'Apr', score: 98, audits: 14, issues: 0 },
  { month: 'May', score: 97, audits: 16, issues: 1 },
  { month: 'Jun', score: 99, audits: 20, issues: 0 },
];

const licenseStatus = [
  { name: 'Active', value: 847, color: '#d4af37' },
  { name: 'Pending Renewal', value: 23, color: '#f4d03f' },
  { name: 'Under Review', value: 12, color: '#b8860b' },
  { name: 'Expired', value: 3, color: '#8b6914' },
];

const recentAudits = [
  { id: 1, vendor: 'Green Valley Farms', status: 'passed', date: '2025-01-15', score: 98 },
  { id: 2, vendor: 'Empire Cannabis Co', status: 'passed', date: '2025-01-14', score: 96 },
  { id: 3, vendor: 'Hudson Botanicals', status: 'review', date: '2025-01-13', score: 89 },
  { id: 4, vendor: 'Upstate Growers', status: 'passed', date: '2025-01-12', score: 100 },
  { id: 5, vendor: 'Brooklyn Buds', status: 'flagged', date: '2025-01-11', score: 72 },
];

const complianceMetrics = [
  { label: 'Overall Score', value: 98.7, suffix: '%', icon: Award, trend: '+2.3%' },
  { label: 'Active Licenses', value: 847, suffix: '', icon: FileText, trend: '+12' },
  { label: 'Audits Completed', value: 156, suffix: '', icon: CheckCircle, trend: '+23' },
  { label: 'Issues Resolved', value: 7, suffix: '', icon: Shield, trend: '-5' },
];

export function Compliance() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

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
              <Link to="/compliance" className="text-gold text-sm tracking-wider">Compliance</Link>
              <Link to="/network" className="nav-link text-sm tracking-wider">Network</Link>
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
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm uppercase tracking-wider">Compliance Fortress</span>
            </div>
            <h1 className="serif text-5xl md:text-6xl font-semibold text-white mb-6">
              NYS OCM <span className="text-gold">Compliance</span> Dashboard
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Real-time regulatory adherence tracking with AI-powered auto-audits, 
              license verification, and instant anomaly detection.
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {complianceMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryCard variant="glass" className="text-center py-6" glow={index === 0}>
                  <metric.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-light text-gold mb-1">
                    <AnimatedCounter value={metric.value} suffix={metric.suffix} duration={2} />
                  </p>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">{metric.label}</p>
                  <span className={`text-xs ${metric.trend.startsWith('+') ? 'text-green-400' : 'text-gold'}`}>
                    {metric.trend} this month
                  </span>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Compliance Score Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <LuxuryCard variant="elevated" className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Compliance Score Trend</h3>
                    <p className="text-white/50 text-sm">Monthly performance overview</p>
                  </div>
                  <div className="flex gap-2">
                    {['3m', '6m', '1y'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 text-xs rounded ${
                          selectedPeriod === period 
                            ? 'bg-gold text-void' 
                            : 'bg-obsidian text-white/60 hover:text-white'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={complianceData}>
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis domain={[90, 100]} stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#121212', 
                          border: '1px solid #d4af37',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#d4af37" 
                        fill="url(#goldGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </LuxuryCard>
            </motion.div>

            {/* License Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <LuxuryCard variant="elevated" className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">License Status Distribution</h3>
                    <p className="text-white/50 text-sm">Current license overview</p>
                  </div>
                  <GoldButton variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </GoldButton>
                </div>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={licenseStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {licenseStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#121212', 
                          border: '1px solid #d4af37',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {licenseStatus.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="text-white/60 text-sm">{status.name}</span>
                      <span className="text-gold text-sm ml-auto">{status.value}</span>
                    </div>
                  ))}
                </div>
              </LuxuryCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Audits */}
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
                  <h3 className="text-xl font-semibold text-white">Recent Auto-Audits</h3>
                  <p className="text-white/50 text-sm">AI-powered compliance verification</p>
                </div>
                <div className="flex gap-3">
                  <GoldButton variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                  </GoldButton>
                  <GoldButton variant="secondary" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </GoldButton>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left py-4 px-4 text-white/50 text-xs uppercase tracking-wider">Vendor</th>
                      <th className="text-left py-4 px-4 text-white/50 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-4 text-white/50 text-xs uppercase tracking-wider">Date</th>
                      <th className="text-left py-4 px-4 text-white/50 text-xs uppercase tracking-wider">Score</th>
                      <th className="text-right py-4 px-4 text-white/50 text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAudits.map((audit) => (
                      <tr key={audit.id} className="border-b border-gold/5 hover:bg-gold/5 transition">
                        <td className="py-4 px-4 text-white font-medium">{audit.vendor}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase ${
                            audit.status === 'passed' ? 'bg-green-500/20 text-green-400' :
                            audit.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {audit.status === 'passed' && <CheckCircle className="w-3 h-3" />}
                            {audit.status === 'review' && <Clock className="w-3 h-3" />}
                            {audit.status === 'flagged' && <AlertTriangle className="w-3 h-3" />}
                            {audit.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white/60">{audit.date}</td>
                        <td className="py-4 px-4">
                          <span className={`text-lg font-semibold ${
                            audit.score >= 90 ? 'text-gold' : 
                            audit.score >= 80 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {audit.score}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-gold hover:text-gold-light transition">
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </LuxuryCard>
          </motion.div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">AI-Powered</p>
            <h2 className="serif text-4xl md:text-5xl font-semibold text-white">Compliance Intelligence</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Auto-Audits', desc: 'Claude-powered compliance verification runs 24/7, flagging anomalies instantly.' },
              { icon: Lock, title: 'License Verification', desc: 'Real-time NYS OCM license status checks with automatic renewal alerts.' },
              { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Grok-forecasted compliance trends help you stay ahead of regulations.' },
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
