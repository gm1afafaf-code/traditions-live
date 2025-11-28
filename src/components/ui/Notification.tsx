import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function NotificationContainer() {
  const notifications = useUIStore((state) => state.notifications);
  const removeNotification = useUIStore((state) => state.removeNotification);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md"
      role="region"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

function NotificationItem({ type, message, duration, onClose }: NotificationItemProps) {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50 border-green-500',
      text: 'text-green-800',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50 border-red-500',
      text: 'text-red-800',
      icon: '✕',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-500',
      text: 'text-yellow-800',
      icon: '⚠',
    },
    info: {
      bg: 'bg-blue-50 border-blue-500',
      text: 'text-blue-800',
      icon: 'ℹ',
    },
  };

  const style = types[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-sm',
        'animate-in slide-in-from-right',
        style.bg
      )}
      role="alert"
    >
      <span className={cn('text-xl', style.text)}>{style.icon}</span>
      <p className={cn('flex-1 text-sm font-medium', style.text)}>{message}</p>
      <button
        onClick={onClose}
        className={cn('text-lg hover:opacity-70', style.text)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
