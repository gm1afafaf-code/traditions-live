import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { NotificationContainer } from '../ui';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-marble">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
      <NotificationContainer />
    </div>
  );
}
