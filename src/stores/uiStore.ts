import { create } from 'zustand';
import type { Notification } from '@/types';
import { generateId } from '@/lib/utils';

interface UIState {
  notifications: Notification[];
  sidebarCollapsed: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;

  // Actions
  addNotification: (
    message: string,
    type?: Notification['type'],
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  notifications: [],
  sidebarCollapsed: false,
  isModalOpen: false,
  modalContent: null,

  addNotification: (message, type = 'info', duration = 5000) => {
    const notification: Notification = {
      id: generateId(),
      message,
      type,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notification.id),
        }));
      }, duration);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  openModal: (content) =>
    set({
      isModalOpen: true,
      modalContent: content,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalContent: null,
    }),
}));
