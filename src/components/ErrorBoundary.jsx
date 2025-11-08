import React from "react";
import PageError from "@/pages/PageError";
import { setGlobalErrorHandler } from "@/utils/globalErrorHandler";
import { useLocation } from "react-router-dom";

// Wrapper to reset error boundary on route change
function ErrorBoundaryWrapper({ children }) {
  const location = useLocation();
  
  return (
    <ErrorBoundary key={location.pathname}>
      {children}
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: null,
    };

    // Set up global error handler for network/API errors
    setGlobalErrorHandler(this.handleGlobalError);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorType: "REACT_ERROR",
    });
  }

  handleGlobalError = (errorData) => {
    // Only show error boundary for critical errors
    if (errorData.type === "NETWORK_ERROR" || errorData.type === "SERVER_ERROR") {
      this.setState({
        hasError: true,
        error: {
          message: errorData.message,
          type: errorData.type,
        },
        errorInfo: null,
        errorType: errorData.type,
      });
    }
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <PageError
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.resetError}
          errorType={this.state.errorType}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWrapper;
