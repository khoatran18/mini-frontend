"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// Define a new type for the error to include the response data
// This helps TypeScript understand the shape of our API errors
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          // This onError function will run for every mutation that fails, anywhere in the app
          onError: (error: ApiError) => {
            // Log the error for debugging purposes.
            // You can also add UI notifications (e.g., a toast) here.
            console.error("Mutation Failed:", JSON.stringify({
              // The generic error message from the Error object
              errorMessage: error.message,
              // The specific error message from our backend payload
              backendMessage: error.response?.data?.message,
              // The full error object for deep debugging
              fullError: error,
            }, null, 2));
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}