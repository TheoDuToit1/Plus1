// src/components/shop/ShopLayout.tsx
import { ReactNode } from 'react';
import ShopTopbar from './ShopTopbar';
import ShopFooter from './ShopFooter';

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <ShopTopbar />
        <main className="flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-[1100px] w-full px-4 md:px-10 gap-8">
            {children}
          </div>
        </main>
        <ShopFooter />
      </div>
    </div>
  );
}
