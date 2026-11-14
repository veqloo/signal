import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/lib/workspace-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Signal — Listen beyond the rating",
  description:
    "Signal helps businesses collect direct customer feedback, spot patterns, and improve their customer experience. Built by Veqlo.",
  keywords: [
    "customer feedback",
    "QR code feedback",
    "NPS software",
    "satisfaction analytics",
    "Google reviews",
    "restaurant feedback",
    "retail feedback",
    "Veqlo",
  ],
  authors: [{ name: "Veqlo", url: "https://veqlo.me" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col text-slate-900 bg-slate-50 antialiased selection:bg-slate-900 selection:text-white">
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </body>
    </html>
  );
}
