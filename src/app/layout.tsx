import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "EroticEcho — Interactive Erotic Stories",
  description:
    "Immersive personalized erotic choose-your-own-adventure. 18+ adults only.",
  applicationName: "EroticEcho",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EroticEcho",
  },
  formatDetection: {
    telephone: false,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0a12" },
    { media: "(prefers-color-scheme: light)", color: "#0d0a12" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} theme-default`}
    >
      <body className="font-body antialiased bg-echo-scene min-h-dvh overscroll-none">
        <Providers>
          <ThemeProvider>
            <Nav />
            <main className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-20 play-main">
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
