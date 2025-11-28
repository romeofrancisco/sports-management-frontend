import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, ExternalLink } from "lucide-react";
import {
  useGoogleDocument,
  useGoogleAuth,
  hasValidTokens,
} from "../hooks/useGoogleEditor";

/**
 * Google Sheets Editor Component
 * Redirects to Google Sheets for spreadsheet editing
 */
const GoogleSheetEditor = ({ documentId }) => {
  const navigate = useNavigate();
  const { isAuthenticating, startAuth } = useGoogleAuth();
  const hasTokens = hasValidTokens();

  // Load document and get Google Drive URL
  const {
    data: documentData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGoogleDocument(documentId);

  // Refetch when tokens become available
  useEffect(() => {
    if (hasTokens && !documentData && !isLoading) {
      refetch();
    }
  }, [hasTokens, documentData, isLoading, refetch]);

  // Redirect to Google Sheets when URL is ready
  useEffect(() => {
    if (documentData?.editUrl || documentData?.webViewLink) {
      const url = documentData.editUrl || documentData.webViewLink;
      window.location.href = url;
    }
  }, [documentData]);

  // Handle Google Sign In
  const handleSignIn = useCallback(() => {
    startAuth(documentId);
  }, [startAuth, documentId]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Not authenticated - show sign in prompt
  if (!hasTokens) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Connect to Google Drive</h2>
          <p className="text-muted-foreground max-w-md">
            To view or edit spreadsheets, you need to sign in with your Google account.
          </p>
        </div>
        <Button 
          onClick={handleSignIn} 
          disabled={isAuthenticating}
          size="lg"
          className="gap-2"
        >
          {isAuthenticating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          Sign in with Google
        </Button>
        <Button variant="ghost" onClick={handleBack}>
          Go Back
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Opening Google Sheets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load spreadsheet</p>
        <p className="text-muted-foreground">{error?.message}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Waiting for redirect (should be brief)
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <ExternalLink className="h-12 w-12 text-primary" />
        <p className="text-muted-foreground">Redirecting to Google Sheets...</p>
        {(documentData?.editUrl || documentData?.webViewLink) && (
          <Button 
            variant="outline" 
            onClick={() => window.location.href = documentData.editUrl || documentData.webViewLink}
          >
            Click here if not redirected
          </Button>
        )}
      </div>
    </div>
  );
};

export default GoogleSheetEditor;
