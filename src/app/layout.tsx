import type { Metadata } from "next";
import { Playfair_Display, Lora, EB_Garamond, Crimson_Text } from "next/font/google";
import "./globals.css";
import "@/styles/textures.css";
import "@/styles/animations.css";
import { AuthProvider } from "@/lib/auth/context";
import { Providers } from "@/lib/providers";
import { ThemeProvider } from "@/styles/theme-provider";
import { Toaster } from "@/components/ui/toaster";

// Elegant serif for headings
const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Readable serif for body text
const lora = Lora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Classic book font for accents
const garamond = EB_Garamond({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Alternative serif
const crimson = Crimson_Text({
  variable: "--font-alt",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pagely - Track Your Reading Journey",
  description: "A modern book reading tracker to help you discover, track, and manage your reading journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${lora.variable} ${garamond.variable} ${crimson.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
