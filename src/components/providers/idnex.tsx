"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { getInitialClientState } from "@/lib/client";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getInitialClientState());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
