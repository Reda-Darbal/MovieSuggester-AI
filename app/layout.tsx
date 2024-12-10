import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Movie & Series Suggester",
  description: "Get personalized recommendations for movies and series based on your preferences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,

       

        variables: {
          colorPrimary: '#2563EB',
          borderRadius: '0.5rem',
        },

        elements: {
          // Global styles for Clerk components
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          formFieldInput: 'border-gray-300 focus:ring-blue-500',
          headerTitle: 'text-2xl font-bold text-center text-blue-600',
          userButtonAvatarBox: 'w-10 h-10',
          userButtonPopoverCard: 'bg-white border border-gray-200 shadow-lg',
          // Customize other elements as needed
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
