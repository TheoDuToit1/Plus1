// src/components/provider/components/ProviderFooter.tsx
import React from 'react';

export default function ProviderFooter() {
  return (
    <footer className="border-t border-primary/10 mt-12 py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                fill="#11d452"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <span className="text-white text-sm font-bold tracking-tighter">+1 REWARDS | DAY1 HEALTH</span>
        </div>
        <p className="text-slate-500 text-xs font-medium">
          © 2023 Day1 Health (Pty) Ltd. Licensed Financial Services Provider. All Rights Reserved.
        </p>
        <div className="flex gap-6">
          <a className="text-slate-500 hover:text-primary text-xs font-bold transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-slate-500 hover:text-primary text-xs font-bold transition-colors" href="#">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
