import { AuthProvider } from "@/contexts/auth/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import OnlineSocketWrapper from "@/components/online-socket-wrapper";

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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NCM67KYJW0"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NCM67KYJW0');
          `}
        </Script>
      </head>
      <body>
        <AuthProvider>
          <Toaster />
          <OnlineSocketWrapper>
            {children}
          </OnlineSocketWrapper>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
