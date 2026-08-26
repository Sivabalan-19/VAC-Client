import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./context/StoreContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
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
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className={`${spaceGrotesk.className} min-h-full flex flex-col`} style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

