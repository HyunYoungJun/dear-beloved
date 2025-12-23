import type { Metadata } from "next";
import { Noto_Serif_KR, Inter } from "next/font/google"; // Import Inter
import GNB from "@/components/GNB";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${notoSerifKr.variable} font-sans antialiased bg-white text-gray-900 group/body tracking-wide leading-relaxed`}
      >
        <AuthProvider>
          <GNB />
          <main className="min-h-screen w-full pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
