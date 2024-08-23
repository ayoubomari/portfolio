import type { Metadata } from "next";
import { Ubuntu as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Ayoub Omari",
  description:
    "Portfolio of Ayoub Omari, a full-stack developer, based in Morocco.",
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
