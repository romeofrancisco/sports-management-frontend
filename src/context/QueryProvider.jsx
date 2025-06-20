import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false, // Avoid unnecessary refetching on tab switch
      refetchOnReconnect: true, // Automatically refetch on network reconnect
      refetchOnMount: true, // Allow refetching when mounting to get fresh data
      retry: 2, // Retry failed queries up to 2 times
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
      suspense: false,
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
