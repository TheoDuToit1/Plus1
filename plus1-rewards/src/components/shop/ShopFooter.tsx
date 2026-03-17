// src/components/shop/ShopFooter.tsx
export default function ShopFooter() {
  return (
    <footer className="mt-auto px-6 md:px-10 py-8 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined">loyalty</span>
          <p className="text-sm">© 2024 +1 Rewards. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Help Center</a>
        </div>
      </div>
    </footer>
  );
}
