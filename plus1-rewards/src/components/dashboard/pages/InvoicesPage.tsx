// plus1-rewards/src/components/dashboard/pages/InvoicesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paid: 0,
    overdue: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: invoicesData } = await supabaseAdmin
        .from('partner_invoices')
        .select('*, partners(shop_name, phone, email)')
        .order('invoice_month', { ascending: false });

      const totalInvoices = invoicesData?.length || 0;
      const paid = invoicesData?.filter(i => i.status === 'paid').length || 0;
      const overdue = invoicesData?.filter(i => {
        if (i.status === 'paid') return false;
        return new Date(i.due_date) < new Date();
      }).length || 0;
      const totalAmount = invoicesData?.reduce((sum, i) => sum + (parseFloat(i.total_amount) || 0), 0) || 0;

      setStats({ totalInvoices, paid, overdue, totalAmount });
      setInvoices(invoicesData || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkPaid = async (invoiceId: string) => {
    if (confirm('Mark this invoice as paid?')) {
      try {
        const { error } = await supabaseAdmin
          .from('partner_invoices')
          .update({ 
            status: 'paid',
            paid_at: new Date().toISOString()
          })
          .eq('id', invoiceId);

        if (error) throw error;
        alert('Invoice marked as paid');
        fetchData();
      } catch (error) {
        console.error('Error marking invoice as paid:', error);
        alert('Failed to update invoice');
      }
    }
  };

  const handleSuspendPartner = async (partnerId: string) => {
    if (confirm('Suspend this partner due to non-payment?')) {
      try {
        const { error } = await supabaseAdmin
          .from('partners')
          .update({ status: 'suspended' })
          .eq('id', partnerId);

        if (error) throw error;
        alert('Partner suspended');
        fetchData();
      } catch (error) {
        console.error('Error suspending partner:', error);
        alert('Failed to suspend partner');
      }
    }
  };

  const handleRefresh = () => fetchData();
  const handleLogout = () => navigate('/');

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  const closeInvoiceModal = () => {
    setSelectedInvoice(null);
  };

  const filteredInvoices = invoices.filter(inv => {
    const searchLower = searchTerm.toLowerCase();
    return searchLower === '' ||
      inv.partners?.shop_name?.toLowerCase().includes(searchLower) ||
      inv.invoice_month?.toLowerCase().includes(searchLower);
  });

  const statsData = [
    { icon: 'receipt', title: 'Total Invoices', value: stats.totalInvoices.toString(), change: '', description: 'All time' },
    { icon: 'check_circle', title: 'Paid', value: stats.paid.toString(), change: '', description: 'Settled invoices' },
    { icon: 'warning', title: 'Overdue', value: stats.overdue.toString(), change: '', description: 'Past due date' },
    { icon: 'payments', title: 'Total Amount', value: `R${stats.totalAmount.toFixed(2)}`, change: '', description: 'All invoices' }
  ];

  return (
    <>
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none transition-all placeholder:text-gray-400"
                placeholder="Search invoices by partner or month..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border border-[#1a558b] bg-white text-[#1a558b] hover:bg-[#1a558b] hover:text-white transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a558b] text-white rounded-lg hover:opacity-90 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Partner Billing & Invoices</h2>
            <p className="text-gray-600 mt-1">Manage monthly partner invoices and payment tracking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, index) => (
              <StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} change={stat.change} description={stat.description} />
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a558b]">list_alt</span>
                All Invoices ({filteredInvoices.length})
              </h3>
              <button className="text-xs text-gray-600 hover:text-[#1a558b] flex items-center gap-1 font-medium transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                Generate Invoice
              </button>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">Loading invoices...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">No invoices found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Invoice #</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Partner</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Month</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Amount</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Due Date</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => {
                      const isOverdue = invoice.status !== 'paid' && new Date(invoice.due_date) < new Date();
                      
                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <span className="text-xs font-mono font-bold text-[#1a558b]">{invoice.id.substring(0, 8).toUpperCase()}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-semibold text-gray-900">{invoice.partners?.name || 'Unknown'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900">{invoice.invoice_month}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-bold text-gray-900">R{parseFloat(invoice.total_amount).toFixed(2)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              invoice.status === 'paid'
                                ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                                : isOverdue
                                ? 'bg-red-500/20 text-red-700 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                            }`}>
                              <span className={`size-1.5 rounded-full ${
                                invoice.status === 'paid' ? 'bg-green-600' : isOverdue ? 'bg-red-600' : 'bg-yellow-500'
                              }`}></span>
                              {invoice.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {invoice.status !== 'paid' && (
                                <>
                                  <button
                                    onClick={() => handleMarkPaid(invoice.id)}
                                    className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg bg-gray-100 hover:bg-green-50"
                                    title="Mark as Paid"
                                  >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                  </button>
                                  {isOverdue && (
                                    <button
                                      onClick={() => handleSuspendPartner(invoice.partner_id)}
                                      className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg bg-gray-100 hover:bg-red-50"
                                      title="Suspend Partner"
                                    >
                                      <span className="material-symbols-outlined text-sm">block</span>
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                onClick={() => handleViewInvoice(invoice)}
                                className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10"
                                title="View Details"
                              >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest text-center">
                Showing {filteredInvoices.length} of {invoices.length} total invoices
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-yellow-600">info</span>
            <div>
              <h4 className="text-sm font-bold text-yellow-900 mb-1">Invoice & Billing Cycle</h4>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Partners issue cashback during the month</li>
                <li>• Invoices generated at month end</li>
                <li>• Grace period applies before suspension</li>
                <li>• Suspended partners cannot process transactions</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">
              © 2024 +1 Rewards Platform Management • Secured Admin Access
            </p>
          </div>
        </div>
      </main>
    </DashboardLayout>

    {/* Invoice Details Modal */}
    {selectedInvoice && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          {/* Modal Header */}
          <div className="border-b border-gray-200 px-8 py-6 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Invoice Details</h2>
              <p className="text-sm text-gray-600 mt-1">Invoice #{selectedInvoice.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <button
              onClick={closeInvoiceModal}
              className="size-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6 bg-gray-50">
            {/* Partner Information */}
            <section>
              <h3 className="text-lg font-bold text-[#1a558b] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">storefront</span>
                Partner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Partner Name</p>
                  <p className="text-sm text-gray-900 font-semibold">{selectedInvoice.partners?.shop_name || 'Unknown'}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Contact Phone</p>
                  <p className="text-sm text-gray-900">{selectedInvoice.partners?.phone || 'Not provided'}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Email</p>
                  <p className="text-sm text-gray-900">{selectedInvoice.partners?.email || 'Not provided'}</p>
                </div>
              </div>
            </section>

            {/* Invoice Details */}
            <section>
              <h3 className="text-lg font-bold text-[#1a558b] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">receipt</span>
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Invoice Month</p>
                  <p className="text-sm text-gray-900 font-semibold">{selectedInvoice.invoice_month}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Due Date</p>
                  <p className="text-sm text-gray-900">{new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Total Amount</p>
                  <p className="text-2xl text-[#1a558b] font-bold">R{parseFloat(selectedInvoice.total_amount).toFixed(2)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedInvoice.status === 'paid'
                      ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                      : new Date(selectedInvoice.due_date) < new Date()
                      ? 'bg-red-500/20 text-red-700 border border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                  }`}>
                    {selectedInvoice.status === 'paid' ? 'Paid' : new Date(selectedInvoice.due_date) < new Date() ? 'Overdue' : 'Pending'}
                  </span>
                </div>
                {selectedInvoice.paid_at && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
                    <p className="text-xs text-gray-600 uppercase font-bold mb-1">Paid At</p>
                    <p className="text-sm text-green-700 font-semibold">{new Date(selectedInvoice.paid_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Timestamps */}
            <section>
              <h3 className="text-lg font-bold text-[#1a558b] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">schedule</span>
                Timestamps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Created At</p>
                  <p className="text-sm text-gray-900">{new Date(selectedInvoice.created_at).toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Updated At</p>
                  <p className="text-sm text-gray-900">{new Date(selectedInvoice.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* Actions */}
            {selectedInvoice.status !== 'paid' && (
              <section className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => {
                    handleMarkPaid(selectedInvoice.id);
                    closeInvoiceModal();
                  }}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Mark as Paid
                </button>
                {new Date(selectedInvoice.due_date) < new Date() && (
                  <button
                    onClick={() => {
                      handleSuspendPartner(selectedInvoice.partner_id);
                      closeInvoiceModal();
                    }}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">block</span>
                    Suspend Partner
                  </button>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
