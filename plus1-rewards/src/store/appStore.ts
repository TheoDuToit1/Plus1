import { create } from 'zustand'

interface User {
  id: string
  name: string
  phone?: string
  dob?: string
  role: 'member' | 'shop' | 'agent' | 'admin'
  qrCode?: string
}

interface AppState {
  user: User | null
  isOnline: boolean
  syncQueue: any[]
  setUser: (user: User | null) => void
  setOnline: (online: boolean) => void
  addToSyncQueue: (item: any) => void
  clearSyncQueue: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isOnline: navigator.onLine,
  syncQueue: [],
  setUser: (user) => set({ user }),
  setOnline: (online) => set({ isOnline: online }),
  addToSyncQueue: (item) => set((state) => ({
    syncQueue: [...state.syncQueue, item]
  })),
  clearSyncQueue: () => set({ syncQueue: [] }),
}))

// Listen for online/offline events
window.addEventListener('online', () => useAppStore.setState({ isOnline: true }))
window.addEventListener('offline', () => useAppStore.setState({ isOnline: false }))
