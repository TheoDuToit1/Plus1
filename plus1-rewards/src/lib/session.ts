// Session management utilities for custom authentication

interface SessionData {
  user?: {
    id: string;
    role: string;
    full_name: string;
    mobile_number: string;
    status: string;
  };
  member?: any;
  partner?: any;
  loggedInAt: string;
  expiresAt: string | null;
  rememberMe: boolean;
  platform?: string;
}

export function getSession(role: 'member' | 'partner' = 'member'): SessionData | null {
  const storageKey = role === 'member' ? 'memberSession' : 'partnerSession';
  
  // Try localStorage first (remember me)
  const localSession = localStorage.getItem(storageKey);
  if (localSession) {
    try {
      const session: SessionData = JSON.parse(localSession);
      
      // Check if session has expired
      if (session.expiresAt) {
        const expiryDate = new Date(session.expiresAt);
        const now = new Date();
        
        if (now > expiryDate) {
          // Session expired, clear it
          localStorage.removeItem(storageKey);
          sessionStorage.removeItem(storageKey);
          return null;
        }
      }
      
      // Sync to sessionStorage if not there (for cross-tab consistency)
      if (!sessionStorage.getItem(storageKey)) {
        sessionStorage.setItem(storageKey, localSession);
      }
      
      return session;
    } catch (e) {
      console.error('Error parsing localStorage session:', e);
      localStorage.removeItem(storageKey);
      return null;
    }
  }
  
  // Try sessionStorage (not remember me)
  const sessionSession = sessionStorage.getItem(storageKey);
  if (sessionSession) {
    try {
      const session: SessionData = JSON.parse(sessionSession);
      
      // Check if session has expired (even for session storage)
      if (session.expiresAt) {
        const expiryDate = new Date(session.expiresAt);
        const now = new Date();
        
        if (now > expiryDate) {
          sessionStorage.removeItem(storageKey);
          return null;
        }
      }
      
      return session;
    } catch (e) {
      console.error('Error parsing sessionStorage session:', e);
      sessionStorage.removeItem(storageKey);
      return null;
    }
  }
  
  return null;
}

export function clearSession(role: 'member' | 'partner' = 'member'): void {
  const storageKey = role === 'member' ? 'memberSession' : 'partnerSession';
  localStorage.removeItem(storageKey);
  sessionStorage.removeItem(storageKey);
}

export function isSessionValid(role: 'member' | 'partner' = 'member'): boolean {
  return getSession(role) !== null;
}
