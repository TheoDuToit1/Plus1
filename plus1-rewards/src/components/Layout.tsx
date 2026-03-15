import React from 'react'
import { useAppStore } from '../store/appStore'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title }: LayoutProps) {
  const { isOnline } = useAppStore()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">+1</span>
            </div>
            <h1 className="text-lg font-bold text-blue-600">Rewards</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-md mx-auto px-4 py-4 text-center text-xs text-gray-600">
          <p>&copy; 2026 +1 Rewards. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
