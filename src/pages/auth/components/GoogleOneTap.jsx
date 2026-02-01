import React, { useEffect, useCallback, useRef } from 'react';
import { useGoogleLogin } from '@/hooks/useAuth';
import { toast } from 'sonner';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleOneTap = () => {
  const googleLoginMutation = useGoogleLogin();
  const initRef = useRef(false);
  const mountedRef = useRef(true);

  const handleCredentialResponse = useCallback(async (response) => {
    if (!mountedRef.current) return;
    
    const idToken = response?.credential;
    if (!idToken) {
      toast.error('No credential received from Google');
      return;
    }
    
    try {
      await googleLoginMutation.mutateAsync(idToken);
    } catch (err) {
      console.error('Google signin failed', err);
    }
  }, [googleLoginMutation]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (!GOOGLE_CLIENT_ID || initRef.current) return;

    const initializeAndPrompt = () => {
      if (!window.google?.accounts?.id || !mountedRef.current) return;
      
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
          use_fedcm_for_prompt: false, // Disable FedCM to avoid CORS/network errors on desktop
        });
        
        initRef.current = true;
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (mountedRef.current && window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
          }
        }, 100);
      } catch (err) {
        console.error('Failed to initialize Google One Tap:', err);
      }
    };

    // Check if GSI is already loaded
    if (window.google?.accounts?.id) {
      initializeAndPrompt();
    } else {
      // Wait for the script to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initializeAndPrompt();
        }
      }, 100);

      const timeout = setTimeout(() => clearInterval(checkInterval), 5000);
      
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch (e) {
          // Ignore cancel errors
        }
      }
    };
  }, [handleCredentialResponse]);

  // This component doesn't render anything visible - One Tap shows as an overlay
  return null;
};

export default GoogleOneTap;
