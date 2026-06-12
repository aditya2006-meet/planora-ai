import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Planora AI — Plan the Future of Travel",
  description:
    "Generate cinematic AI-powered travel itineraries, discover hidden gems, optimize your budget, and experience futuristic trip planning with Planora AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className="h-full antialiased"
        style={{ background: "#050811" }}
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-full flex flex-col" style={{ background: "#050811" }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
