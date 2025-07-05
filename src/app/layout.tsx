import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/Global/mode-toggle";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pinggo - Next Gen Social Media",
    template: "%s | Pinggo",
  },
  description: "Connect with friends and the world on Pinggo, the next generation social media platform.",
  keywords: ["social media", "Pinggo", "connect", "next gen", "chat", "video"],
  authors: [{ name: "Pinggo Team", url: "https://pinggo.example.com" }],
  openGraph: {
    title: "Pinggo - Next Gen Social Media",
    description: "Connect with friends and the world on Pinggo, the next generation social media platform.",
    url: "https://pinggo.example.com",
    siteName: "Pinggo",
    images: [
      {
        url: "https://pinggo.example.com/og-image.png",
        width: 1200, 
        height: 630,
        alt: "Pinggo Social Media Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider appearance={{baseTheme:dark}}>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
      </ClerkProvider>
    </html>
  );
}
