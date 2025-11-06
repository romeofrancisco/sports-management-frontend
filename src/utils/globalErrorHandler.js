// Global error handler for network errors
let globalErrorHandler = null;

export const setGlobalErrorHandler = (handler) => {
  globalErrorHandler = handler;
};

export const triggerGlobalError = (error) => {
  if (globalErrorHandler) {
    globalErrorHandler(error);
  }
};
