// plus1-rewards/src/components/agent/AgentTopbar.tsx
interface Agent {
  id: string;
  name: string;
  phone: string;
  total_commission: number;
}

interface AgentTopbarProps {
  agent: Agent | null;
  onSignOut: () => void;
}

export default function AgentTopbar({ agent, onSignOut }: AgentTopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-solid border-[#1a3324] px-6 md:px-10 py-4 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50" style={{ borderBottomWidth: '0.2px' }}>
      <div className="flex items-center gap-4">
        <div className="size-8 text-cyan-400">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16z" fill="currentColor"></path>
            <path d="M24 10c-7.73 0-14 6.27-14 14s6.27 14 14 14 14-6.27 14-14-6.27-14-14-14z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Agent Portal</h2>
      </div>
      <div className="flex flex-1 justify-end items-center gap-6">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-slate-400 text-sm font-medium">{agent?.name || 'Agent'}</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500"></span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-500">Active</span>
          </div>
        </div>
        <button 
          onClick={onSignOut}
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-cyan-500 text-background-dark text-sm font-bold transition-all hover:bg-cyan-600"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
