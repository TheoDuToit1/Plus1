// src/components/dashboard/components/MembersTable.tsx
interface Member {
  id: string;
  name: string;
  avatar: string;
  status: string;
  balance: string;
  joinedDate: string;
}

interface MembersTableProps {
  members: Member[];
}

export default function MembersTable({ members }: MembersTableProps) {
  const handleView = (memberId: string) => {
    console.log('View member:', memberId);
  };

  const handleEdit = (memberId: string) => {
    console.log('Edit member:', memberId);
  };

  const handleBlock = (memberId: string) => {
    console.log('Block member:', memberId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-primary/5">
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Member ID
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Name
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Status
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Rewards Balance
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Joined Date
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-primary/10 transition-colors group">
              <td className="px-6 py-4">
                <span className="text-xs font-mono font-bold text-primary px-2 py-1 bg-primary/10 rounded">
                  {member.id}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img 
                      className="size-full object-cover" 
                      alt={`Member ${member.name} profile photo`}
                      src={member.avatar}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{member.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">
                  <span className="size-1.5 rounded-full bg-primary"></span>
                  {member.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-slate-200">{member.balance}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-400">{member.joinedDate}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleView(member.id)}
                    className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg bg-slate-800/50 hover:bg-primary/10" 
                    title="View Details"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                  <button 
                    onClick={() => handleEdit(member.id)}
                    className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg bg-slate-800/50 hover:bg-primary/10" 
                    title="Edit Member"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button 
                    onClick={() => handleBlock(member.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg bg-slate-800/50 hover:bg-red-400/10" 
                    title="Block Member"
                  >
                    <span className="material-symbols-outlined text-sm">block</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {/* Empty State Simulation / Footer row placeholder */}
          <tr className="bg-primary/5">
            <td className="px-6 py-3 text-center" colSpan={6}>
              <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">
                Showing {members.length} of {members.length} total records
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
