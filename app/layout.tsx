import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "./context/StoreContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VAC Portal - Value Added Courses",
  description: "Value Added Course Management System for Students, Faculty, and Administrators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col font-sans`}>
        <StoreProvider>
          {children}
        </StoreProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}