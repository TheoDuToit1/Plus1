// plus1-rewards/src/components/ProtectedPolicyProviderRoute.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedPolicyProviderRouteProps {
  children: React.ReactNode;
}

export default function ProtectedPolicyProviderRoute({ children }: ProtectedPolicyProviderRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        navigate('/provider/login');
        return;
      }

      // Check provider status in database
      const { data: providerData, error: providerError } = await supabase
        .from('policy_providers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (providerError || !providerData) {
        localStorage.removeItem('currentProvider');
        navigate('/provider/login');
        return;
      }

      // Check if provider is active
      if (providerData.status !== 'active') {
        localStorage.removeItem('currentProvider');
        await supabase.auth.signOut();
        navigate('/provider/login');
        return;
      }

      // Store provider data
      localStorage.setItem('currentProvider', JSON.stringify({
        id: providerData.id,
        name: providerData.name,
        email: providerData.email,
        company_name: providerData.company_name,
        status: providerData.status
      }));

      setAuthorized(true);
    } catch (error) {
      console.error('Authorization check failed:', error);
      navigate('/provider/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}