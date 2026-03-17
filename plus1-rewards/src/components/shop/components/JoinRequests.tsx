// src/components/shop/components/JoinRequests.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface JoinRequest {
  id: string;
  member_id: string;
  shop_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
  member: {
    name: string;
    phone: string;
  };
}

interface JoinRequestsProps {
  shopId: string | null;
}

export default function JoinRequests({ shopId }: JoinRequestsProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (shopId) {
      loadRequests();
    }
  }, [shopId]);

  const loadRequests = async () => {
    if (!shopId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('join_requests')
        .select(`
          *,
          member:members(name, phone)
        `)
        .eq('shop_id', shopId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error loading join requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'approved' | 'rejected', memberId: string) => {
    setProcessingId(requestId);
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('join_requests')
        .update({ 
          status: action,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, create wallet for member
      if (action === 'approved') {
        const { error: walletError } = await supabase
          .from('wallets')
          .insert({
            member_id: memberId,
            shop_id: shopId,
            balance: 0,
            rewards_total: 0,
            policies: { name: 'Day-to-Day Single', current: 0, target: 385, status: 'active' }
          });

        if (walletError && walletError.code !== '23505') {
          // If not duplicate key error, throw it
          throw walletError;
        }
      }

      // Remove from pending list
      setRequests(prev => prev.filter(r => r.id !== requestId));
      
      alert(`Request ${action} successfully!`);
    } catch (err: any) {
      alert(`Failed to ${action} request: ` + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (!shopId) return null;

  return (
    <div className="flex flex-col rounded-2xl bg-[#162d1e] border border-[#1a3324] overflow-hidden shadow-2xl" style={{ borderWidth: '0.2px' }}>
      <div className="p-6 border-b border-[#1a3324]" style={{ borderWidth: '0.2px' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group_add</span>
            Join Requests
          </h2>
          {requests.length > 0 && (
            <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
              {requests.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <div className="size-16 rounded-full bg-[#0a1a10] flex items-center justify-center text-slate-400 mx-auto mb-4 border-2 border-dashed border-[#1a3324]">
              <span className="material-symbols-outlined text-3xl">group_add</span>
            </div>
            <p className="text-slate-400 font-medium">No pending join requests</p>
            <p className="text-slate-500 text-sm">Members can request to join your shop from the app</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-[#0a1a10] border border-[#1a3324] rounded-xl p-4" style={{ borderWidth: '0.2px' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold">{request.member.name}</h3>
                    <p className="text-slate-400 text-sm">{request.member.phone}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {request.message && (
                  <p className="text-slate-300 text-sm mb-4 italic">"{request.message}"</p>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(request.id, 'approved', request.member_id)}
                    disabled={processingId === request.id}
                    className="flex-1 py-2 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors disabled:opacity-50"
                  >
                    {processingId === request.id ? 'Processing...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleRequest(request.id, 'rejected', request.member_id)}
                    disabled={processingId === request.id}
                    className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {processingId === request.id ? 'Processing...' : '✗ Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}