import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { PageTransitionProvider } from "../components/navigation/PageTransitionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DropPilot - Premium Multi-Tenant Dropshipping Platform",
  description: "Enterprise multi-store management, supplier automation, and independent dropshipping storefront builder.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
        <AuthProvider>
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
