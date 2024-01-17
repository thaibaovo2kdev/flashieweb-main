"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Providers({ children }) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <NextUIProvider>{children}</NextUIProvider>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Providers;
