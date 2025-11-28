import { useUIStore } from '@/stores/uiStore';
import type { NotificationType } from '@/types';

/**
 * Hook for showing notifications
 */
export function useNotification() {
  const { addNotification } = useUIStore();

  const showSuccess = (message: string, duration?: number) => {
    addNotification(message, 'success', duration);
  };

  const showError = (message: string, duration?: number) => {
    addNotification(message, 'error', duration);
  };

  const showWarning = (message: string, duration?: number) => {
    addNotification(message, 'warning', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    addNotification(message, 'info', duration);
  };

  const show = (message: string, type: NotificationType = 'info', duration?: number) => {
    addNotification(message, type, duration);
  };

  return {
    show,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
