// src/components/provider/ProviderDashboard.tsx
import React from 'react';
import ProviderLayout from './ProviderLayout';
import Dashboard from './pages/Dashboard';

export default function ProviderDashboard() {
  return (
    <div className="bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ProviderLayout>
        <Dashboard />
      </ProviderLayout>
    </div>
  );
}
