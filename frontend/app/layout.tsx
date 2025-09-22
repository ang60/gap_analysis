import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Gap Analysis System - Kenyan Banking Compliance Platform",
  description: "Comprehensive compliance & risk management platform for Kenyan banking sector. ISO 27001:2022 compliance, CBK guidelines, and automated gap analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
