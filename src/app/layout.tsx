import type { Metadata, Viewport } from "next";
import { cormorant, inter } from "./fonts";
import { site } from "@/lib/config";
import { getDict, getLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import "./globals.css";

export function generateMetadata(): Metadata {
  const dict = getDict();
  return {
    title: {
      default: `${site.name}, ${dict.site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: dict.site.description,
    metadataBase: new URL(site.url),
    icons: {
      icon: "/brand/monogram-tile.png",
      apple: "/brand/apple-touch-icon.png",
    },
    openGraph: {
      title: site.name,
      description: dict.site.description,
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1C1C1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const dict = getDict();
  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LocaleProvider locale={locale} dict={dict}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
