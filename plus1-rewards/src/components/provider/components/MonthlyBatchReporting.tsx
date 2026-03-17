// src/components/provider/components/MonthlyBatchReporting.tsx
import React from 'react';

interface MonthlyBatchReportingProps {
  currentMonth?: string;
  version?: string;
  previousReports?: string[];
  onExport?: () => void;
  isExporting?: boolean;
}

export default function MonthlyBatchReporting({
  currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  version = 'v1.02',
  previousReports = ['Sept 2023', 'Aug 2023', 'July 2023'],
  onExport,
  isExporting = false,
}: MonthlyBatchReportingProps) {
  const handleDownloadCSV = () => {
    if (onExport) {
      onExport();
    }
  };

  const handlePreviousReport = (report: string) => {
    console.log(`Previous report clicked: ${report}`);
  };

  return (
    <section className="bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] rounded-2xl p-6 flex flex-col gap-6 shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">cloud_download</span>
          <h3 className="text-white text-lg font-black">Monthly Batch Reporting</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Download the comprehensive reconciliation file for your internal auditing.
        </p>
        <p className="text-primary/80 text-xs italic flex items-start gap-2">
          <span className="material-symbols-outlined text-[14px] flex-shrink-0 mt-0.5">security</span>
          <span>POPIA Compliant: Aggregated policy totals only. No PII included.</span>
        </p>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Previous Reports</h4>
        <div className="flex flex-wrap gap-2">
          {previousReports.map((report, index) => (
            <button
              key={index}
              onClick={() => handlePreviousReport(report)}
              className="px-3 py-1.5 rounded-lg bg-[#0f2818] border border-[#1a3324] text-slate-300 text-xs font-bold hover:border-primary/50 hover:text-white transition-all"
            >
              {report}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 border-t border-[#1a3324]">
        <button
          onClick={handleDownloadCSV}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background-dark rounded-xl font-black text-sm shadow-[0_10px_30px_rgba(17,212,82,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">{isExporting ? 'hourglass_empty' : 'download'}</span>
          {isExporting ? 'Exporting...' : 'Download CSV'}
        </button>
        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">
          {currentMonth} ({version})
        </p>
      </div>
    </section>
  );
}
