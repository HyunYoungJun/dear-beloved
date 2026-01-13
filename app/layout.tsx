import type { Metadata } from "next";
// import { Noto_Serif_KR, Inter } from "next/font/google"; // Removed
import GNB from "@/components/GNB";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

// Font configurations removed to enforce global Malgun Gothic

export const metadata: Metadata = {
  title: "Dear˚Beloved | 사랑하는 당신을 위한 마지막 기록",
  description: "온라인 메모리얼 및 디지털 추모 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
      </head>
      <body
        className={`font-sans antialiased bg-white text-gray-900 group/body tracking-wide leading-relaxed`}
      >
        <AuthProvider>
          <GNB />
          <main className="min-h-screen w-full pt-16">
            {children}
          </main>
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
