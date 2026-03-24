// plus1-rewards/src/components/dashboard/pages/ApprovalsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';
import { Notification, useNotification } from '../../Notification';

type ApprovalTab = 'partners' | 'agents' | 'providers' | 'cover_plans' | 'linked_people';

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<ApprovalTab>('partners');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [pendingPartners, setPendingPartners] = useState<any[]>([]);
  const [pendingAgents, setPendingAgents] = useState<any[]>([]);
  const [pendingProviders, setPendingProviders] = useState<any[]>([]);
  const [coverPlanRequests, setCoverPlanRequests] = useState<any[]>([]);
  const [linkedPeopleRequests, setLinkedPeopleRequests] = useState<any[]>([]);
  
  // Modal states
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [allAgents, setAllAgents] = useState<any[]>([]);
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  const [stats, setStats] = useState({
    totalPending: 0,
    partners: 0,
    agents: 0,
    providers: 0,
    coverPlans: 0,
    linkedPeople: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching approvals data...');
      
      // Fetch pending partners
      const { data: partners, error: partnersError } = await supabaseAdmin
        .from('partners')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (partnersError) {
        console.error('❌ Partners error:', partnersError);
      } else {
        console.log('✅ Partners:', partners?.length || 0);
      }

      // Fetch pending agents (without join since FK relationship doesn't exist)
      const { data: agents, error: agentsError } = await supabaseAdmin
        .from('agents')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (agentsError) {
        console.error('❌ Agents error:', agentsError);
      } else {
        console.log('✅ Agents:', agents?.length || 0);
        
        // Fetch user details for each agent
        if (agents && agents.length > 0) {
          const agentsWithUsers = await Promise.all(
            agents.map(async (agent) => {
              const { data: user } = await supabaseAdmin
                .from('users')
                .select('full_name, mobile_number, email')
                .eq('id', agent.user_id)
                .single();
              
              return { ...agent, users: user };
            })
          );
          setPendingAgents(agentsWithUsers);
        } else {
          setPendingAgents([]);
        }
      }

      // Fetch ALL active agents for assignment dropdown
      const { data: activeAgents } = await supabaseAdmin
        .from('agents')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (activeAgents && activeAgents.length > 0) {
        const activeAgentsWithUsers = await Promise.all(
          activeAgents.map(async (agent) => {
            const { data: user } = await supabaseAdmin
              .from('users')
              .select('full_name, mobile_number, email')
              .eq('id', agent.user_id)
              .single();
            
            return { ...agent, users: user };
          })
        );
        setAllAgents(activeAgentsWithUsers);
      } else {
        setAllAgents([]);
      }

      // Fetch pending providers (if table exists)
      const { data: providers, error: providersError } = await supabaseAdmin
        .from('providers')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (providersError) {
        console.error('❌ Providers error:', providersError);
      } else {
        console.log('✅ Providers:', providers?.length || 0);
      }

      setPendingPartners(partners || []);
      if (agentsError) {
        setPendingAgents([]);
      }
      setPendingProviders(providers || []);

      const totalPending = (partners?.length || 0) + (agents?.length || 0) + (providers?.length || 0);
      
      console.log('📊 Total pending:', totalPending);
      
      setStats({
        totalPending,
        partners: partners?.length || 0,
        agents: agents?.length || 0,
        providers: providers?.length || 0,
        coverPlans: 0,
        linkedPeople: 0
      });
    } catch (error) {
      console.error('❌ Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprovePartner = async (partnerId: string, assignedAgentId?: string) => {
    try {
      const updateData: any = { 
        status: 'active',
        approved_at: new Date().toISOString()
      };

      const { error } = await supabaseAdmin
        .from('partners')
        .update(updateData)
        .eq('id', partnerId);

      if (error) throw error;

      // If agent is assigned, create the link in partner_agent_links table
      if (assignedAgentId) {
        const { error: linkError } = await supabaseAdmin
          .from('partner_agent_links')
          .insert({
            partner_id: partnerId,
            agent_id: assignedAgentId,
            status: 'active'
          });

        if (linkError) {
          console.error('Error linking agent:', linkError);
          showWarning('Partial Success', 'Partner approved but failed to assign agent. Please assign manually.');
        } else {
          showSuccess('Success!', 'Partner approved and agent assigned successfully!');
        }
      } else {
        showSuccess('Success!', 'Partner approved successfully!');
      }
      
      fetchData();
    } catch (error) {
      console.error('Error approving partner:', error);
      showError('Error', 'Failed to approve partner. Please try again.');
    }
  };

  const handleRejectPartner = async (partnerId: string) => {
    setConfirmAction({
      title: 'Reject Partner Application?',
      message: 'Are you sure you want to reject this partner application? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const { error } = await supabaseAdmin
            .from('partners')
            .update({ status: 'rejected' })
            .eq('id', partnerId);

          if (error) throw error;
          showSuccess('Rejected', 'Partner application has been rejected.');
          fetchData();
        } catch (error) {
          console.error('Error rejecting partner:', error);
          showError('Error', 'Failed to reject partner. Please try again.');
        }
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleApproveAgent = async (agentId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('agents')
        .update({ 
          status: 'active',
          approved_at: new Date().toISOString()
        })
        .eq('id', agentId);

      if (error) throw error;
      showSuccess('Success!', 'Agent approved successfully!');
      fetchData();
    } catch (error) {
      console.error('Error approving agent:', error);
      showError('Error', 'Failed to approve agent. Please try again.');
    }
  };

  const handleRejectAgent = async (agentId: string) => {
    setConfirmAction({
      title: 'Reject Agent Application?',
      message: 'Are you sure you want to reject this agent application? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const { error } = await supabaseAdmin
            .from('agents')
            .update({ status: 'rejected' })
            .eq('id', agentId);

          if (error) throw error;
          showSuccess('Rejected', 'Agent application has been rejected.');
          fetchData();
        } catch (error) {
          console.error('Error rejecting agent:', error);
          showError('Error', 'Failed to reject agent. Please try again.');
        }
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleRefresh = () => fetchData();
  const handleLogout = () => navigate('/');

  const statsData = [
    { icon: 'pending_actions', title: 'Total Pending', value: stats.totalPending.toString(), change: '', description: 'Awaiting approval' },
    { icon: 'storefront', title: 'Partners', value: stats.partners.toString(), change: '', description: 'Partner applications' },
    { icon: 'support_agent', title: 'Agents', value: stats.agents.toString(), change: '', description: 'Agent applications' },
    { icon: 'business', title: 'Providers', value: stats.providers.toString(), change: '', description: 'Provider access requests' }
  ];

  return (
    <DashboardLayout>
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        {/* Topbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Approvals Management</h1>
            <p className="text-gray-600 mt-1">Review and approve pending applications and requests</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                description={stat.description}
              />
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-xl border border-gray-200 w-fit shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'partners' ? 'bg-[#1a558b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Partners ({stats.partners})
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'agents' ? 'bg-[#1a558b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Agents ({stats.agents})
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'providers' ? 'bg-[#1a558b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Providers ({stats.providers})
            </button>
            <button
              onClick={() => setActiveTab('cover_plans')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'cover_plans' ? 'bg-[#1a558b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Cover Plan Changes ({stats.coverPlans})
            </button>
            <button
              onClick={() => setActiveTab('linked_people')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'linked_people' ? 'bg-[#1a558b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Linked People ({stats.linkedPeople})
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
            {/* Partners Tab */}
            {activeTab === 'partners' && (
              <div>
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1a558b]">storefront</span>
                    Pending Partner Applications ({pendingPartners.length})
                  </h3>
                </div>
                
                {loading ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : pendingPartners.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">check_circle</span>
                    <p className="text-gray-600">No pending partner applications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {pendingPartners.map((partner) => (
                      <div key={partner.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{partner.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Business Type</p>
                                <p className="text-sm text-gray-900">{partner.business_type || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Location</p>
                                <p className="text-sm text-gray-900">{partner.location || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Commission Rate</p>
                                <p className="text-sm text-[#1a558b] font-bold">{partner.commission_rate}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Phone</p>
                                <p className="text-sm text-gray-900">{partner.phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Email</p>
                                <p className="text-sm text-gray-900">{partner.email || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Applied</p>
                                <p className="text-sm text-gray-900">{new Date(partner.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {partner.agreement_accepted && (
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Agreement Accepted
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => handleApprovePartner(partner.id)}
                              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectPartner(partner.id)}
                              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">cancel</span>
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem({ ...partner, type: 'partner' });
                                setShowDetailsModal(true);
                              }}
                              className="px-6 py-2 bg-[#1a558b] hover:bg-[#1a558b]/90 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              View Details
                            </button>
                            <button
                              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">phone</span>
                              Call Required
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Agents Tab */}
            {activeTab === 'agents' && (
              <div>
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1a558b]">support_agent</span>
                    Pending Agent Applications ({pendingAgents.length})
                  </h3>
                </div>
                
                {loading ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : pendingAgents.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">check_circle</span>
                    <p className="text-gray-600">No pending agent applications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {pendingAgents.map((agent) => (
                      <div key={agent.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{agent.users?.full_name || 'Unknown'}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">ID Number</p>
                                <p className="text-sm text-gray-900">{agent.id_number || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Phone</p>
                                <p className="text-sm text-gray-900">{agent.users?.mobile_number || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Email</p>
                                <p className="text-sm text-gray-900">{agent.users?.email || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-bold">Applied</p>
                                <p className="text-sm text-gray-900">{new Date(agent.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {agent.agreement_file && (
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">description</span>
                                Agreement Uploaded
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => handleApproveAgent(agent.id)}
                              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectAgent(agent.id)}
                              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">cancel</span>
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem({ ...agent, type: 'agent' });
                                setShowDetailsModal(true);
                              }}
                              className="px-6 py-2 bg-[#1a558b] hover:bg-[#1a558b]/90 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              View Details
                            </button>
                            <button
                              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">info</span>
                              Request Info
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div>
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1a558b]">business</span>
                    Pending Provider Access Requests ({pendingProviders.length})
                  </h3>
                </div>
                
                <div className="px-6 py-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">business</span>
                  <p className="text-gray-600">No pending provider access requests</p>
                  <p className="text-sm text-gray-500 mt-2">Provider access management coming soon</p>
                </div>
              </div>
            )}

            {/* Cover Plan Changes Tab */}
            {activeTab === 'cover_plans' && (
              <div>
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1a558b]">health_and_safety</span>
                    Cover Plan Change Requests ({stats.coverPlans})
                  </h3>
                </div>
                
                <div className="px-6 py-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">health_and_safety</span>
                  <p className="text-gray-600">No pending cover plan change requests</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="material-symbols-outlined text-sm align-middle">info</span>
                    Important: Telephonic conversation required before approval
                  </p>
                </div>
              </div>
            )}

            {/* Linked People Tab */}
            {activeTab === 'linked_people' && (
              <div>
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1a558b]">group_add</span>
                    Linked People / Dependant Requests ({stats.linkedPeople})
                  </h3>
                </div>
                
                <div className="px-6 py-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">group_add</span>
                  <p className="text-gray-600">No pending linked people requests</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="material-symbols-outlined text-sm align-middle">info</span>
                    Important: Telephonic conversation required before approval
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">
              © 2024 +1 Rewards Platform Management • Secured Admin Access
            </p>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedItem && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowDetailsModal(false)}
          >
            <div 
              className="rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              style={{ backgroundColor: '#ffffff' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-[#1a558b] text-3xl">
                      {selectedItem.type === 'partner' ? 'storefront' : 'support_agent'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      {selectedItem.type === 'partner' ? selectedItem.shop_name || selectedItem.name : selectedItem.users?.full_name || 'Unknown'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedItem.type === 'partner' ? 'Partner Application' : 'Agent Application'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-600 hover:text-gray-900 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 bg-gray-50">
                <div className="px-6 py-6 space-y-6">
                  {/* Partner Details */}
                  {selectedItem.type === 'partner' && (
                    <>
                      {/* Basic Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">storefront</span>
                          Business Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Shop Name</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.shop_name || selectedItem.name || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Business Type</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.business_type || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Category</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.category || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Cashback Percent</p>
                            <p className="text-sm text-[#1a558b] font-bold">{selectedItem.cashback_percent || selectedItem.commission_rate || 0}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Location</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.location || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Address</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.address || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">contact_phone</span>
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Responsible Person</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.responsible_person || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Phone</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.phone || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Email</p>
                            <p className="text-sm text-gray-900 font-semibold break-all">{selectedItem.email || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Products Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">inventory_2</span>
                          Products & Services
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Included Products</p>
                            <p className="text-sm text-gray-900">{selectedItem.included_products || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Excluded Products</p>
                            <p className="text-sm text-gray-900">{selectedItem.excluded_products || 'None'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Agent Assignment */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">person_add</span>
                          Assign Sales Agent
                        </h3>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">
                            Assign a sales agent to manage this partner shop and earn commissions on transactions.
                          </p>
                          <div>
                            <label className="block text-xs text-gray-600 uppercase tracking-wider mb-2">
                              Select Agent
                            </label>
                            <select
                              value={selectedAgentId}
                              onChange={(e) => setSelectedAgentId(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a558b] focus:border-transparent"
                            >
                              <option value="">No agent assigned</option>
                              {allAgents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                  {agent.users?.full_name || 'Unknown'} - {agent.users?.mobile_number || 'No phone'}
                                </option>
                              ))}
                            </select>
                            {allAgents.length === 0 && (
                              <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                No active agents available. Approve agents first.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">info</span>
                          Application Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">User ID</p>
                            <p className="text-sm text-gray-900 font-mono">{selectedItem.user_id || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Applied Date</p>
                            <p className="text-sm text-gray-900 font-semibold">{new Date(selectedItem.created_at).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Agreement Status</p>
                            <p className="text-sm text-gray-900 font-semibold">
                              {selectedItem.agreement_accepted ? (
                                <span className="text-green-600 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">check_circle</span>
                                  Accepted
                                </span>
                              ) : (
                                <span className="text-yellow-600">Pending</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Agent Details */}
                  {selectedItem.type === 'agent' && (
                    <>
                      {/* Personal Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">person</span>
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Full Name</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.users?.full_name || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">ID Number</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.id_number || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Mobile Number</p>
                            <p className="text-sm text-gray-900 font-semibold">{selectedItem.users?.mobile_number || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Email</p>
                            <p className="text-sm text-gray-900 font-semibold break-all">{selectedItem.users?.email || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Agreement Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">description</span>
                          Agreement Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Agreement File</p>
                            {selectedItem.agreement_file ? (
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">check_circle</span>
                                <a 
                                  href={selectedItem.agreement_file} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline font-semibold"
                                >
                                  View Agreement Document
                                </a>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No agreement file uploaded</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1a558b]">info</span>
                          Application Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">User ID</p>
                            <p className="text-sm text-gray-900 font-mono">{selectedItem.user_id || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Applied Date</p>
                            <p className="text-sm text-gray-900 font-semibold">{new Date(selectedItem.created_at).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Status</p>
                            <p className="text-sm text-gray-900 font-semibold">
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded text-xs font-bold uppercase">
                                {selectedItem.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (selectedItem.type === 'partner') {
                            handleApprovePartner(selectedItem.id, selectedAgentId || undefined);
                          } else {
                            handleApproveAgent(selectedItem.id);
                          }
                          setShowDetailsModal(false);
                          setSelectedAgentId('');
                        }}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                        {selectedItem.type === 'partner' && selectedAgentId ? 'Approve & Assign Agent' : 'Approve Application'}
                      </button>
                      <button
                        onClick={() => {
                          if (selectedItem.type === 'partner') {
                            handleRejectPartner(selectedItem.id);
                          } else {
                            handleRejectAgent(selectedItem.id);
                          }
                          setShowDetailsModal(false);
                          setSelectedAgentId('');
                        }}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">cancel</span>
                        Reject Application
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && confirmAction && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowConfirmModal(false)}
          >
            <div 
              className="rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
              style={{ backgroundColor: '#ffffff' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
                  </div>
                  <h2 className="text-xl font-black text-gray-900">{confirmAction.title}</h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                <p className="text-gray-700 leading-relaxed">{confirmAction.message}</p>
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction.onConfirm}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
