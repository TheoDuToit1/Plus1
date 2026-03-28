// plus1-rewards/src/components/dashboard/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 opacity-50">
        <div className="size-5 bg-[#1a558b] rounded-sm flex items-center justify-center text-[10px] text-white font-black">+1</div>
        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600">Rewards Platform Engine v2.4.0</p>
      </div>
      
      <div className="flex gap-6 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
        <a className="hover:text-[#1a558b] transition-colors" href="#">Documentation</a>
        <a className="hover:text-[#1a558b] transition-colors" href="#">Security Audit</a>
        <a className="hover:text-[#1a558b] transition-colors" href="#">Support</a>
      </div>
    </footer>
  );
}
