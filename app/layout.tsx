import type { Metadata } from "next";
import { Ubuntu as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Ayoub Omari - Full Stack Web3 Developer",
  description:
    "Full Stack Developer specializing in Go, TypeScript, and Blockchain development. Experienced in building scalable web applications, smart contracts, and distributed systems using modern technologies like React, Next.js, and Algorand.",
  keywords: [
    "Full Stack Developer",
    "Web3",
    "Blockchain",
    "Algorand",
    "Smart Contracts",
    "E-commerce",
    "React",
    "golang",
    "Node.js",
    "Spring Boot",
    "Ayoub Omari",
  ],
  authors: [{ name: "Ayoub Omari" }],
  openGraph: {
    title: "Ayoub Omari - Full Stack Web3 Developer Portfolio",
    description:
      "Discover Ayoub Omari's innovative projects and professional experience in full-stack development, Web3, and blockchain technologies.",
    url: `${env.NEXT_PUBLIC_SITE_URL}`,
    siteName: "Ayoub Omari Portfolio",
    images: [
      {
        url: `${env.NEXT_PUBLIC_SITE_URL}/images/icons/icon.webp`,
        width: 1200,
        height: 630,
        alt: "Ayoub Omari's Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayoub Omari - Full Stack Web3 Developer Portfolio",
    description:
      "Discover Ayoub Omari's innovative projects and professional experience in full-stack development, Web3, and blockchain technologies.",
    images: [`${env.NEXT_PUBLIC_SITE_URL}/images/icons/icon.webp`],
    creator: "@AyoubOmari01",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 ${fontSans.className}`}
      >
        <ThemeProvider>
          <ReactQueryProvider>
            {children}
            <Toaster />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
