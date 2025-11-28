import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import api from "@/api";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

// Storage key for Google tokens
const GOOGLE_TOKENS_KEY = "google_drive_tokens";

/**
 * Get stored Google tokens from localStorage
 */
export const getStoredTokens = () => {
  try {
    const tokens = localStorage.getItem(GOOGLE_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
};

/**
 * Store Google tokens in localStorage
 */
export const storeTokens = (tokens) => {
  localStorage.setItem(GOOGLE_TOKENS_KEY, JSON.stringify(tokens));
};

/**
 * Clear stored tokens
 */
export const clearTokens = () => {
  localStorage.removeItem(GOOGLE_TOKENS_KEY);
};

/**
 * Check if user has valid Google tokens
 */
export const hasValidTokens = () => {
  const tokens = getStoredTokens();
  return tokens && tokens.access_token;
};

/**
 * Hook to manage Google OAuth2 authentication state
 */
export const useGoogleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidTokens());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    setIsAuthenticated(hasValidTokens());
  }, []);

  /**
   * Start Google OAuth2 flow
   */
  const startAuth = useCallback(async (documentId = null) => {
    setIsAuthenticating(true);
    try {
      // Must include /google-callback path to match Google Cloud Console settings
      const redirectUri = `${window.location.origin}/google-callback`;
      const { data } = await api.get("/documents/google/auth/", {
        params: {
          redirect_uri: redirectUri,
          document_id: documentId || "",
        },
      });

      // Store document ID for redirect
      if (documentId) {
        sessionStorage.setItem("pending_document_id", documentId);
      }

      // Redirect to Google OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Failed to start auth:", error);
      toast.error("Failed to start Google authentication");
      setIsAuthenticating(false);
    }
  }, []);

  /**
   * Handle OAuth callback - exchange code for tokens
   */
  const handleCallback = useCallback(async (code) => {
    setIsAuthenticating(true);
    try {
      const redirectUri = `${window.location.origin}/google-callback`;
      const { data } = await api.post("/documents/google/token/", {
        code,
        redirect_uri: redirectUri,
      });

      if (data.tokens) {
        storeTokens(data.tokens);
        setIsAuthenticated(true);
        toast.success("Connected to Google Drive");
        return data.tokens;
      }
    } catch (error) {
      console.error("Failed to exchange token:", error);
      toast.error("Failed to connect to Google Drive");
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  /**
   * Sign out from Google
   */
  const signOut = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);
    toast.info("Disconnected from Google Drive");
  }, []);

  return {
    isAuthenticated,
    isAuthenticating,
    tokens: getStoredTokens(),
    startAuth,
    handleCallback,
    signOut,
  };
};

/**
 * Hook to load a document and get its Google Drive embed URL
 * Requires Google OAuth tokens
 */
export const useGoogleDocument = (documentId) => {
  const tokens = getStoredTokens();

  return useQuery({
    queryKey: ["google-document", documentId, !!tokens],
    queryFn: async () => {
      if (!tokens) {
        throw new Error("Not authenticated with Google");
      }

      // First, get document info
      const { data: docInfo } = await api.get(`/documents/files/${documentId}/`);
      if (!docInfo) throw new Error("Document not found");

      // Ensure a Google Drive file exists or create one via create endpoint
      // Prefer the embed endpoint to avoid re-uploading if already present
      let data;
      try {
        const { data: embedData } = await api.get(`/documents/google/embed/${documentId}/`);
        data = embedData;
      } catch {
        // Fallback: trigger legacy upload flow to create a Drive copy
        const resp = await api.post("/documents/google/upload/", {
          documentId,
          tokens,
        });
        data = resp.data;
        // Invalidate folder queries to refresh UI after upload
        try {
          // Use folder id from document info if available
          const folderId = docInfo?.folder || resp?.data?.document?.folder || null;
          if (folderId !== undefined) {
            queryClient.invalidateQueries({ queryKey: ["folder-contents", folderId] });
          }
          queryClient.invalidateQueries({ queryKey: ["root-folders"] });
        } catch (e) {
          console.warn("Failed to invalidate queries after Google upload:", e);
        }
      }

      console.log("Google Drive upload response:", data);

      // Normalize file extension
      const rawExt = docInfo.file_extension || "";
      const ext = rawExt.replace(/^\./, "").toLowerCase();

      return {
        ...data,
        // Map editUrl to embedUrl for backwards compatibility
        embedUrl: data.editUrl || data.embedUrl,
        documentId,
        fileExtension: ext,
        isDocx: ["doc", "docx"].includes(ext),
        isExcel: ["xls", "xlsx"].includes(ext),
      };
    },
    enabled: !!documentId && !!tokens,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to sync changes from Google Drive back to Cloudinary
 */
export const useSyncFromGoogleDrive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }) => {
      const tokens = getStoredTokens();
      if (!tokens) throw new Error("Not authenticated with Google");

      const { data } = await api.post("/documents/google/sync/", {
        documentId,
        tokens,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("Document saved successfully", {
        description: "Your changes have been saved to cloud storage.",
        richColors: true,
      });
      queryClient.invalidateQueries(["google-document", variables.documentId]);
      queryClient.invalidateQueries(["document-editor", variables.documentId]);
    },
    onError: (error) => {
      const msg = error.response?.data?.error || error.message || "Save failed";
      toast.error("Failed to save document", {
        description: msg,
        richColors: true,
      });
    },
  });
};

/**
 * Hook to delete the Google Drive copy when closing editor
 */
export const useDeleteGoogleDriveFile = () => {
  return useMutation({
    mutationFn: async ({ documentId }) => {
      const tokens = getStoredTokens();
      const { data } = await api.post("/documents/google/delete/", {
        documentId,
        tokens,
      });
      return data;
    },
    onError: (error) => {
      console.error("Failed to delete Google Drive file:", error);
    },
  });
};

/**
 * Hook to get just the embed URL for an already-uploaded document
 */
export const useGoogleEmbedUrl = (documentId) => {
  return useQuery({
    queryKey: ["google-embed", documentId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/google/embed/${documentId}/`);
      return data;
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
  });
};
