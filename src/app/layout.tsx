import "@/styles/tailwind.css";
import { Inter as FontSans } from "next/font/google";

import { Toaster } from "sonner";
import { ClientProvider } from "@/components/providers/idnex";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ClientProvider>{children}</ClientProvider>
        <Toaster closeButton position="top-right" richColors />
      </body>
    </html>
  );
}
