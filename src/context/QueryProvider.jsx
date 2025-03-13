import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes (adjust based on how fresh data should be)
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Avoid unnecessary refetching on tab switch
      refetchOnReconnect: true, // Automatically refetch on network reconnect
      refetchOnMount: false, // Avoid refetching when mounting a cached query
      retry: 3, // Retry failed queries up to 3 times before giving up
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
      keepPreviousData: true, // Keep old data while fetching new
      suspense: false, // Enable suspense for React Suspense support
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
