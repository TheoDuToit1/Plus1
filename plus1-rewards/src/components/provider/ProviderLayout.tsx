// src/components/provider/ProviderLayout.tsx
import React from 'react';
import ProviderTopbar from './ProviderTopbar';

interface Provider {
  id: string;
  name: string;
}

interface ProviderLayoutProps {
  children: React.ReactNode;
  provider?: Provider | null;
  onSignOut?: () => void;
}

export default function ProviderLayout({ children, provider, onSignOut }: ProviderLayoutProps) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <ProviderTopbar provider={provider} onSignOut={onSignOut} />
        {children}
      </div>
    </div>
  );
}
