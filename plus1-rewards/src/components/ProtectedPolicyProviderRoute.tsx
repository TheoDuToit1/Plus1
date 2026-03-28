// plus1-rewards/src/components/ProtectedPolicyProviderRoute.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const checkAuthorization = () => {
    try {
      // Check if Day1Health provider is logged in via sessionStorage or localStorage
      const providerData = sessionStorage.getItem('currentProvider') || localStorage.getItem('currentProvider');
      
      if (!providerData) {
        navigate('/provider/login');
        return;
      }

      const provider = JSON.parse(providerData);
      
      // Verify it's Day1Health and status is active
      if (provider.id === 'day1health' && provider.status === 'active') {
        setAuthorized(true);
      } else {
        sessionStorage.removeItem('currentProvider');
        localStorage.removeItem('currentProvider');
        navigate('/provider/login');
      }
    } catch (error) {
      console.error('Authorization check failed:', error);
      sessionStorage.removeItem('currentProvider');
      localStorage.removeItem('currentProvider');
      navigate('/provider/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}