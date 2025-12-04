import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { storeTokens, getStoredTokens } from "@/features/editors/hooks/useGoogleEditor";
import { queryClient } from "@/context/QueryProvider";
import { Loader2 } from "lucide-react";
import api from "@/api";
import { toast } from "sonner";

/**
 * Google OAuth2 callback page
 * Handles the redirect from Google after user authorization
 * Supports both popup flow (sends message to parent) and redirect flow
 */
export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);
  // Ref to prevent duplicate token exchanges (React Strict Mode causes double mount)
  const isProcessingRef = useRef(false);

  // Check if this is a new tab flow (set by useFileCard when opening auth)
  // This is more reliable than checking window.opener which can be true for new tabs too
  const isNewTabFlow = sessionStorage.getItem("google_auth_new_tab") === "true";
  
  // Clear the flag immediately so it doesn't persist
  useEffect(() => {
    if (isNewTabFlow) {
      sessionStorage.removeItem("google_auth_new_tab");
    }
  }, [isNewTabFlow]);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const stateParam = searchParams.get("state");
      const errorParam = searchParams.get("error");

      console.log("Google callback received:", { code: !!code, state: stateParam, error: errorParam, isNewTabFlow });

      // Prevent duplicate processing (React Strict Mode or double-click)
      if (isProcessingRef.current) {
        console.log("Already processing callback, skipping...");
        return;
      }
      isProcessingRef.current = true;

      // Check if this code was already used (stored in sessionStorage)
      const usedCode = sessionStorage.getItem("used_oauth_code");
      if (code && usedCode === code) {
        console.log("This authorization code was already used, redirecting...");
        navigate("/documents", { replace: true });
        return;
      }

      if (errorParam) {
        const errorMessage = `Google authorization failed: ${errorParam}`;
        setError(errorMessage);
        setProcessing(false);
        setTimeout(() => navigate("/documents"), 3000);
        return;
      }

      if (!code) {
        const errorMessage = "No authorization code received";
        setError(errorMessage);
        setProcessing(false);
        setTimeout(() => navigate("/documents"), 3000);
        return;
      }

      try {
        // Parse state to get document ID
        let documentId = null;
        if (stateParam) {
          try {
            const stateData = JSON.parse(stateParam);
            documentId = stateData.document_id;
          } catch {
            // Try sessionStorage fallback
            documentId = sessionStorage.getItem("pending_document_id");
          }
        } else {
          documentId = sessionStorage.getItem("pending_document_id");
        }

        // Exchange code for tokens
        const redirectUri = `${window.location.origin}/google-callback`;
        const { data } = await api.post("/documents/google/token/", {
          code,
          redirect_uri: redirectUri,
        });

        // Mark this code as used to prevent re-use
        sessionStorage.setItem("used_oauth_code", code);

        if (data.tokens) {
          storeTokens(data.tokens);
          
          // Open the document directly in this tab
          toast.success("Connected to Google Drive");
          
          // Clean up document ID
          sessionStorage.removeItem("pending_document_id");
          const pendingAction = sessionStorage.getItem('pending_action');
          const pendingTargetFolder = sessionStorage.getItem('pending_target_folder');

          // If we have a document ID and there's a pending paste action, perform paste
          if (documentId && pendingAction === 'paste') {
              try {
              const tokens = getStoredTokens();
              const { data: copyData } = await api.post(`/documents/files/${documentId}/copy/`, {
                target_folder: pendingTargetFolder === 'null' ? null : pendingTargetFolder,
                tokens,
              });
              // Invalidate folder queries to refresh UI after paste/copy
              try {
                const targetFolderId = pendingTargetFolder === 'null' ? null : pendingTargetFolder;
                queryClient.invalidateQueries({ queryKey: ["folder-contents", targetFolderId] });
                queryClient.invalidateQueries({ queryKey: ["root-folders"] });
              } catch (e) {
                console.warn('Failed to invalidate queries after paste:', e);
              }
              toast.success('File pasted and copied to Google Drive');
              sessionStorage.removeItem('pending_action');
              sessionStorage.removeItem('pending_target_folder');
              navigate('/documents', { replace: true });
              return;
            } catch (copyErr) {
              console.error('Failed to perform paste action:', copyErr);
              toast.error('Connected to Google Drive, but paste failed');
              navigate('/documents', { replace: true });
              return;
            }
          }

          // If we have a document ID, open it directly in Google Drive
          if (documentId) {
            try {
              const tokens = getStoredTokens();
              const { data: docData } = await api.post("/documents/google/open/", {
                documentId,
                tokens,
              });
              // If a new copy was created, invalidate queries for folder contents
              if (docData?.isCopy) {
                try {
                  const targetFolderId = docData?.folder || null;
                  queryClient.invalidateQueries({ queryKey: ["folder-contents", targetFolderId] });
                  queryClient.invalidateQueries({ queryKey: ["root-folders"] });
                } catch (e) {
                  console.warn('Failed to invalidate queries after open-copy:', e);
                }
              }

              if (docData.editUrl || docData.webViewLink) {
                // Open document directly in this tab (no new window needed)
                window.location.href = docData.editUrl || docData.webViewLink;
              } else {
                navigate("/documents", { replace: true });
              }
            } catch (openError) {
              console.error("Failed to open document:", openError);
              toast.error("Connected to Google Drive, but failed to open document");
              navigate("/documents", { replace: true });
            }
          } else {
            navigate("/documents", { replace: true });
          }
        } else {
          throw new Error("No tokens received");
        }
      } catch (err) {
        console.error("Google auth error:", err);
        isProcessingRef.current = false; // Reset on error so user can retry
        
        const errorMessage = err.response?.data?.error || "Failed to complete Google authentication";
        
        // If it's an invalid_grant error, the code was likely already used or expired
        if (errorMessage.includes("expired") || errorMessage.includes("already used")) {
          setError("Authorization expired. Please try again.");
          // Clear the stored code so a new one can be used
          sessionStorage.removeItem("used_oauth_code");
        } else {
          setError(errorMessage);
        }
        
        setProcessing(false);
        setTimeout(() => navigate("/documents"), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {error ? (
        <div className="text-center">
          <p className="text-destructive text-lg mb-2">{error}</p>
          <p className="text-muted-foreground">Redirecting to documents...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Connecting to Google Drive...</p>
          <p className="text-muted-foreground">Please wait, opening document...</p>
        </div>
      )}
    </div>
  );
}
