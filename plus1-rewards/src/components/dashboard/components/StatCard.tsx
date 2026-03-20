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
    <div className="bg-white border border-gray-200 p-6 rounded-xl group hover:border-[#1a558b] transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="material-symbols-outlined text-[#1a558b] bg-[#1a558b]/10 p-2 rounded-lg">
          {icon}
        </span>
        <span className="text-[#1a558b] text-xs font-bold">{change}</span>
      </div>
      <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-[10px] text-gray-500 mt-2 italic">{description}</p>
    </div>
  );
}
