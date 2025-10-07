import React, { useEffect, useState } from 'react';
import { useSupabase } from './SupabaseProvider'; // Import useSupabase
import Auth from './Auth'; // Assuming an Auth component for login/signup

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabase } = useSupabase();
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      // Supabase client might not be ready yet, or there's an initialization error
      console.warn('Supabase client not available in AuthGuard.');
      setLoading(false); // Allow rendering Auth component if client is not ready
      return;
    }

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Error getting session:', error);
        // This is where the "Failed to fetch" might originate if the initial session check fails
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Correctly destructure the subscription object
    const { data: { subscription: authListenerSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      // Call unsubscribe on the subscription object
      authListenerSubscription?.unsubscribe();
    };
  }, [supabase]); // Dependency on supabase ensures effect re-runs if client changes (though it should be stable)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-lg text-slate-700">Loading authentication...</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />; // Render Auth component if no session
  }

  return <>{children}</>;
};

export default AuthGuard;
