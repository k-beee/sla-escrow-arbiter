import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SLAEscrow Arbiter | GenLayer",
  description: "Decentralized Milestone & SLA Escrow with Live Web Consensus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080b10] text-[#e1e7f0] antialiased selection:bg-[#00f0ff] selection:text-black">
        {children}
      </body>
    </html>
  );
}
