import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '../ui';

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        'sidebar h-full border-r border-black/5 flex flex-col z-40 transition-all bg-white/80 backdrop-blur-sm',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-black/5 flex items-center justify-between">
        <Link to={ROUTES.HOME}>
          <h1 className="serif text-xl font-semibold tracking-[0.12em] text-gold">
            {sidebarCollapsed ? 'V' : 'VOUCHED'}
          </h1>
        </Link>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded bg-black/5 hover:bg-black/10 flex items-center justify-center"
            aria-label="Collapse sidebar"
          >
            <svg className="w-3 h-3 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
          </button>
        )}
      </div>

      {/* User Info */}
      {user && !sidebarCollapsed && (
        <div className="p-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-gold text-sm font-medium">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal text-sm truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-gold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <NavItem to={ROUTES.VAULT} active={isActive(ROUTES.VAULT)} icon="◇" label="VAULT" collapsed={sidebarCollapsed} />
        <NavItem to={ROUTES.BROKER_DASHBOARD} active={isActive(ROUTES.BROKER_DASHBOARD)} icon="◈" label="PORTAL" collapsed={sidebarCollapsed} />

        {user?.role === 'admin' && (
          <NavItem to={ROUTES.ADMIN_DASHBOARD} active={isActive(ROUTES.ADMIN_DASHBOARD)} icon="⚙" label="ADMIN" collapsed={sidebarCollapsed} />
        )}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-black/5">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start"
        >
          <span className="text-sm">→</span>
          {!sidebarCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}

interface NavItemProps {
  to: string;
  active: boolean;
  icon: string;
  label: string;
  collapsed: boolean;
}

function NavItem({ to, active, icon, label, collapsed }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 transition-colors',
        active
          ? 'text-gold bg-gold/10 border-r-2 border-gold'
          : 'text-slate hover:text-charcoal hover:bg-black/5'
      )}
    >
      <span className="text-sm">{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
}
