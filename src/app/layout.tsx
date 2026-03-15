import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg-page">
        <Suspense fallback={null}>
          <TRPCReactProvider>
            <Navbar />
            {children}
          </TRPCReactProvider>
        </Suspense>
      </body>
    </html>
  );
}
