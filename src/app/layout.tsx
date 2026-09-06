import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
  Noto_Sans_Arabic,
  Space_Grotesk,
} from "next/font/google";
import { PreferencesProvider } from "@/lib/i18n/context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StarWall by AGRON — Maritime Security Intelligence",
    template: "%s",
  },
  description:
    "Intelligence, integration, and decision support for yacht, marina, port, and private island security.",
  icons: {
    icon: "/SW3.png",
    apple: "/SW3.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${inter.variable} ${notoArabic.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <PreferencesProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </PreferencesProvider>
      </body>
    </html>
  );
}
