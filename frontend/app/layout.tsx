//Layout front

import type { Metadata } from "next";
import { Pixelify_Sans, VT323 } from "next/font/google";
import "./globals.css";


const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
});

const vt323 = VT323({
  subsets: ["latin", "vietnamese"], // Bao gồm cả tiếng Việt
  weight: ["400"], // VT323 chỉ có một trọng lượng
});


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
      <body
        className={`${vt323.className} font-pixelify`}
      >
        {children}
      </body>
    </html>
  );
}
