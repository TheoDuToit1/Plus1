// src/components/dashboard/components/StatCard.tsx
interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  change: string;
  description: string;
}

export default function StatCard({ icon, title, value, change, description }: StatCardProps) {
  return (
    <div className="bg-primary/5 border border-primary/10 p-6 rounded-xl group hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
          {icon}
        </span>
        <span className="text-primary text-xs font-bold">{change}</span>
      </div>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
      <p className="text-[10px] text-slate-500 mt-2 italic">{description}</p>
    </div>
  );
}
