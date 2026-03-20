// src/components/partner/pages/MonthlyInvoice.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import PartnerLayout from '../PartnerLayout';

interface Partner {
  id: string;
  name: string;
  commission_rate: number;
  email?: string;
  phone?: string;
}

interface Transaction {
  id: string;
  purchase_amount: number;
  member_reward: number;
  created_at: string;
}

export default function MonthlyInvoice() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadInvoiceData();
  }, [selectedMonth, selectedYear]);

  const loadInvoiceData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/partner/login');
        return;
      }

      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!partnerData) {
        navigate('/partner/login');
        return;
      }

      setPartner(partnerData);

      // Get transactions for selected month
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

      const { data: txData } = await supabase
        .from('transactions')
        .select('id, purchase_amount, member_reward, created_at')
        .eq('partner_id', partnerData.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      setTransactions(txData || []);
    } catch (error) {
      console.error('Error loading invoice data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = transactions.reduce((sum, tx) => sum + tx.purchase_amount, 0);
  const totalRewardsIssued = transactions.reduce((sum, tx) => sum + tx.member_reward, 0);
  const platformFee = totalSales * 0.01; // 1% platform fee
  const agentFee = totalSales * 0.01; // 1% agent fee
  const totalFees = platformFee + agentFee;
  const netAmount = totalSales - totalFees;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Invoice download functionality coming soon!');
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading invoice...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Invoice</h1>
          <p className="text-gray-600">Billing summary for {monthNames[selectedMonth]} {selectedYear}</p>
        </div>
        <button
          onClick={() => navigate('/partner/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Month Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm print:hidden">
        <div className="flex gap-4 items-center">
          <label className="text-gray-700 font-medium">Select Period:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="member-input-override px-4 py-2 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg text-gray-900"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="member-input-override px-4 py-2 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg text-gray-900"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoice */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Invoice Header */}
        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-[#1a558b] to-[#2d7ab8]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">+1 Rewards</h2>
              <p className="text-white/80 text-sm">Partner Invoice</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Invoice Period</p>
              <p className="text-white font-bold text-xl">{monthNames[selectedMonth]} {selectedYear}</p>
            </div>
          </div>
        </div>

        {/* Partner Details */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-3">BILLED TO</h3>
              <p className="text-gray-900 font-bold text-lg">{partner?.name}</p>
              {partner?.email && <p className="text-gray-600 text-sm">{partner.email}</p>}
              {partner?.phone && <p className="text-gray-600 text-sm">{partner.phone}</p>}
              <p className="text-gray-500 text-xs mt-2">Partner ID: {partner?.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-semibold mb-3">SUMMARY</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Commission Rate:</span>
                  <span className="text-gray-900 font-bold">{partner?.commission_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Total Transactions:</span>
                  <span className="text-gray-900 font-bold">{transactions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="p-8">
          <h3 className="text-gray-900 font-bold text-lg mb-4">Financial Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Total Sales Volume</span>
              <span className="text-gray-900 font-bold">R{totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Rewards Issued to Members</span>
              <span className="text-[#1a558b] font-bold">R{totalRewardsIssued.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Platform Fee (1%)</span>
              <span className="text-gray-900 font-bold">R{platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Agent Fee (1%)</span>
              <span className="text-gray-900 font-bold">R{agentFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-gray-300">
              <span className="text-gray-700 font-semibold">Total Fees</span>
              <span className="text-gray-900 font-bold">R{totalFees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-4 bg-[#1a558b]/10 rounded-lg px-4">
              <span className="text-gray-900 font-bold text-lg">Net Amount</span>
              <span className="text-[#1a558b] font-black text-2xl">R{netAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 border-t border-gray-200 bg-gray-50 flex gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">print</span>
            Print Invoice
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a558b] text-white font-bold py-3 rounded-xl hover:bg-[#1a558b]/90 transition-colors"
          >
            <span className="material-symbols-outlined">download</span>
            Download PDF
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-100 text-center border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Thank you for partnering with +1 Rewards
          </p>
          <p className="text-gray-500 text-xs mt-1">
            For questions about this invoice, contact support@plus1rewards.co.za
          </p>
        </div>
      </div>
    </PartnerLayout>
  );
}
