import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { NotificationContainer } from '../ui';
import { 
  LayoutDashboard, 
  Store, 
  Shield, 
  Network, 
  Truck,
  LogOut,
  Menu,
  X,
  Leaf,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const navItems = [
  { to: ROUTES.VAULT, icon: Store, label: 'Marketplace' },
  { to: ROUTES.BROKER_DASHBOARD, icon: LayoutDashboard, label: 'Portal' },
  { to: ROUTES.COMPLIANCE, icon: Shield, label: 'Compliance' },
  { to: ROUTES.NETWORK, icon: Network, label: 'Network' },
  { to: ROUTES.TRACKING, icon: Truck, label: 'Tracking' },
];

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-stone-50">
        <main>{children}</main>
        <NotificationContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-stone-200 z-40 transition-all duration-300 hidden md:flex flex-col',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="serif text-xl font-semibold text-stone-900 tracking-wider">
                <span className="text-amber-600">V</span>OUCHED
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        {user && !sidebarCollapsed && (
          <div className="p-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 text-sm font-semibold">
                {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 text-sm truncate">
                  {user.firstName || ''} {user.lastName || ''}
                </p>
                <p className="text-xs text-amber-600 uppercase tracking-wider font-medium">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 mx-3 px-3 py-3 rounded-xl transition-all',
                  active
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                  active ? 'bg-amber-100' : 'bg-stone-100'
                )}>
                  <item.icon className={cn('w-5 h-5', active ? 'text-amber-600' : 'text-stone-500')} />
                </div>
                {!sidebarCollapsed && (
                  <span className={cn('text-sm font-medium', active ? 'text-amber-700' : 'text-stone-600')}>
                    {item.label}
                  </span>
                )}
                {active && !sidebarCollapsed && (
                  <div className="ml-auto w-1.5 h-6 bg-amber-500 rounded-full" />
                )}
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              className={cn(
                'flex items-center gap-3 mx-3 px-3 py-3 rounded-xl transition-all mt-2',
                isActive(ROUTES.ADMIN_DASHBOARD)
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
              )}
            >
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center',
                isActive(ROUTES.ADMIN_DASHBOARD) ? 'bg-amber-100' : 'bg-stone-100'
              )}>
                <Shield className={cn('w-5 h-5', isActive(ROUTES.ADMIN_DASHBOARD) ? 'text-amber-600' : 'text-stone-500')} />
              </div>
              {!sidebarCollapsed && (
                <span className={cn('text-sm font-medium', isActive(ROUTES.ADMIN_DASHBOARD) ? 'text-amber-700' : 'text-stone-600')}>
                  Admin
                </span>
              )}
            </Link>
          )}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-3 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-stone-200 z-40 md:hidden flex items-center justify-between px-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="serif text-lg font-semibold text-stone-900">
            <span className="text-amber-600">V</span>OUCHED
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <span className="serif text-lg font-semibold text-stone-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {user && (
                <div className="p-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-semibold">
                      {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">
                        {user.firstName || ''} {user.lastName || ''}
                      </p>
                      <p className="text-xs text-amber-600 uppercase tracking-wider font-medium">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        active
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-stone-600 hover:bg-stone-50'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5', active ? 'text-amber-600' : 'text-stone-400')} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {user?.role === 'admin' && (
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive(ROUTES.ADMIN_DASHBOARD)
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-stone-600 hover:bg-stone-50'
                    )}
                  >
                    <Shield className={cn('w-5 h-5', isActive(ROUTES.ADMIN_DASHBOARD) ? 'text-amber-600' : 'text-stone-400')} />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-100">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40 md:hidden">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.slice(0, 4).map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-1 py-2 px-3"
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  active ? 'bg-amber-100' : 'bg-transparent'
                )}>
                  <item.icon className={cn('w-5 h-5', active ? 'text-amber-600' : 'text-stone-400')} />
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  active ? 'text-amber-600' : 'text-stone-500'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-2 px-3"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-stone-400" />
            </div>
            <span className="text-xs font-medium text-stone-500">More</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={cn(
        'min-h-screen transition-all duration-300',
        'pt-16 pb-20 md:pt-0 md:pb-0',
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      )}>
        {children}
      </main>

      <NotificationContainer />
    </div>
  );
}
