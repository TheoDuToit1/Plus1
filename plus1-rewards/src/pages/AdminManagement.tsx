import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Entity {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  created_at: string;
  type: 'member' | 'shop' | 'agent' | 'policy_provider';
}

export function AdminManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'members' | 'shops' | 'agents' | 'providers'>('members');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadEntities();
  }, [activeTab]);

  const loadEntities = async () => {
    setLoading(true);
    setError('');
    try {
      let tableName = '';
      switch (activeTab) {
        case 'members': tableName = 'members'; break;
        case 'shops': tableName = 'shops'; break;
        case 'agents': tableName = 'agents'; break;
        case 'providers': tableName = 'policy_providers'; break;
      }

      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedData: Entity[] = (data || []).map(item => ({
        id: item.id,
        name: item.name || item.company_name || 'Unknown',
        email: item.email,
        phone: item.phone,
        status: item.status || 'active',
        created_at: item.created_at,
        type: activeTab === 'providers' ? 'policy_provider' : activeTab.slice(0, -1) as any
      }));

      setEntities(mappedData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  const updateEntityStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    try {
      let tableName = '';
      switch (activeTab) {
        case 'members': tableName = 'members'; break;
        case 'shops': tableName = 'shops'; break;
        case 'agents': tableName = 'agents'; break;
        case 'providers': tableName = 'policy_providers'; break;
      }

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setEntities(prev => prev.map(entity => 
        entity.id === id ? { ...entity, status: newStatus } : entity
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteEntity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    setActionLoading(true);
    try {
      let tableName = '';
      switch (activeTab) {
        case 'members': tableName = 'members'; break;
        case 'shops': tableName = 'shops'; break;
        case 'agents': tableName = 'agents'; break;
        case 'providers': tableName = 'policy_providers'; break;
      }

      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state
      setEntities(prev => prev.filter(entity => entity.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete record');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter and search logic
  const filteredEntities = entities.filter(entity => {
    const matchesFilter = filter === 'all' || entity.status === filter;
    const matchesSearch = !searchTerm || 
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.phone?.includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });
  return (
    <div className="page-wrapper">
      <header style={{ background: '#fff', borderBottom: '1px solid var(--gray-border)', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>Admin Management</h1>
            <p style={{ color: 'var(--gray-text)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Manage users, shops, agents, and policy providers
            </p>
          </div>
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            style={{ 
              background: 'var(--gray-light)', border: 'none', borderRadius: '8px', 
              padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' 
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-border)' }}>
            {[
              { key: 'members', label: 'Members', icon: '👤' },
              { key: 'shops', label: 'Shops', icon: '🏪' },
              { key: 'agents', label: 'Agents', icon: '📊' },
              { key: 'providers', label: 'Policy Providers', icon: '🏥' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  background: activeTab === tab.key ? 'var(--blue)' : 'transparent',
                  color: activeTab === tab.key ? '#fff' : 'var(--gray-text)',
                  border: 'none', borderRadius: '8px 8px 0 0',
                  padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters and Search */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-border)',
                background: '#fff', fontSize: '0.875rem' 
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, minWidth: '200px', padding: '0.5rem', borderRadius: '8px',
                border: '1px solid var(--gray-border)', fontSize: '0.875rem'
              }}
            />
            
            <button 
              onClick={loadEntities}
              disabled={loading}
              style={{
                background: 'var(--blue)', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.875rem',
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              {loading ? '⏳' : '🔄'} Refresh
            </button>
          </div>
          {/* Error Display */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {/* Data Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({filteredEntities.length})
              </h2>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  border: '3px solid var(--gray-border)', borderTopColor: 'var(--blue)',
                  margin: '0 auto', animation: 'spin 1s linear infinite' 
                }} />
                <p style={{ marginTop: '1rem', color: 'var(--gray-text)' }}>Loading {activeTab}...</p>
              </div>
            ) : filteredEntities.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-text)' }}>
                No {activeTab} found matching your criteria
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntities.map(entity => (
                      <tr key={entity.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{entity.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-text)' }}>
                            ID: {entity.id.slice(0, 8)}...
                          </div>
                        </td>
                        <td>
                          <div>{entity.email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-text)' }}>
                            {entity.phone}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            entity.status === 'active' ? 'badge-green' :
                            entity.status === 'suspended' ? 'badge-red' :
                            'badge-yellow'
                          }`}>
                            {entity.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--gray-text)' }}>
                          {new Date(entity.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                              value={entity.status}
                              onChange={(e) => updateEntityStatus(entity.id, e.target.value)}
                              disabled={actionLoading}
                              style={{
                                padding: '0.25rem', fontSize: '0.75rem', borderRadius: '4px',
                                border: '1px solid var(--gray-border)', background: '#fff'
                              }}
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="pending">Pending</option>
                            </select>
                            <button
                              onClick={() => deleteEntity(entity.id)}
                              disabled={actionLoading}
                              style={{
                                background: '#ef4444', color: '#fff', border: 'none',
                                borderRadius: '4px', padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem', cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}