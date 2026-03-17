// plus1-rewards/src/components/agent/AgentLayout.tsx
import { ReactNode } from 'react';
import AgentTopbar from './AgentTopbar';
import AgentFooter from './AgentFooter';

interface Agent {
  id: string;
  name: string;
  phone: string;
  total_commission: number;
}

interface AgentLayoutProps {
  children: ReactNode;
  agent: Agent | null;
  onSignOut: () => void;
}

export default function AgentLayout({ children, agent, onSignOut }: AgentLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark">
      <div className="layout-container flex h-full grow flex-col w-full">
        <AgentTopbar 
          agent={agent}
          onSignOut={onSignOut}
        />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
          {children}
        </main>
        <AgentFooter />
      </div>
    </div>
  );
}
