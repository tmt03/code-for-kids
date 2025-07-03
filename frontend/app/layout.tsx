import { AuthProvider } from "@/contexts/auth/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scriptbies",
  description: "Learn coding with Scriptbies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster />
            {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
