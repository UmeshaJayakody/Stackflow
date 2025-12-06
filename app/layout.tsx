import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackFlow",
  description: "Manage your inventory efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 z-0 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_0%,rgba(255,255,255,0)_80%)]" />
          <div className="stars-background absolute inset-0" />
        </div>
        <style>{`
          .stars-background {
            background-image: 
              radial-gradient(2px 2px at 20px 30px, rgba(0,0,0,0.05), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 40px 70px, rgba(0,0,0,0.03), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 50px 160px, rgba(0,0,0,0.04), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 90px 40px, rgba(0,0,0,0.03), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 130px 80px, rgba(0,0,0,0.05), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 160px 120px, rgba(0,0,0,0.04), rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: twinkle 5s ease-in-out infinite;
            opacity: 0.3;
          }
          @keyframes twinkle {
            0% { opacity: 0.3; }
            50% { opacity: 0.5; }
            100% { opacity: 0.3; }
          }
        `}</style>
        <div className="relative z-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
