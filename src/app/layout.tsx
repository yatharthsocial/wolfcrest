import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { ContactDock } from "@/components/chat/contact-dock";
import { JsonLd } from "@/components/json-ld";
import { PosterPopup } from "@/components/poster-popup";
import { SITE_URL, organizationJsonLd, site, websiteJsonLd } from "@/lib/site";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Wolf Crest Real Estate | Luxury Property & Off-Plan Advisory in Dubai",
    // Pages set just their own name, e.g. "About" -> "About | The Wolf Crest"
    template: "%s | The Wolf Crest",
  },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  category: "Real Estate",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: "The Wolf Crest Real Estate | Luxury Property & Off-Plan Advisory in Dubai",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wolf Crest Real Estate | Luxury Property & Off-Plan Advisory in Dubai",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1c1a18",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
        <ContactDock />
        <PosterPopup />
      </body>
    </html>
  );
}
