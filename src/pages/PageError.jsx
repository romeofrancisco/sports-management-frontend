import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router";

const PageError = ({ error, errorInfo, onReset, errorType }) => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  const getErrorMessage = () => {
    if (errorType === "NETWORK_ERROR") {
      return "Unable to connect to the server. Please check your internet connection or try again later.";
    }
    if (errorType === "SERVER_ERROR") {
      return "The server encountered an error. Please try again later or contact support if the issue persists.";
    }
    return (
      error?.message ||
      "We're sorry, but an unexpected error has occurred. Please try again later or contact support if the issue persists."
    );
  };

  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, something went wrong!
        </h1>
        <p className="mt-4 text-muted-foreground">{getErrorMessage()}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button onClick={navigateHome}>Go to Homepage</Button>
          {onReset && (
            <Button onClick={onReset} variant="outline">
              Reload Page
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageError;
