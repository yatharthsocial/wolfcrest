import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { ContactDock } from "@/components/chat/contact-dock";
import { PosterPopup } from "@/components/poster-popup";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "The Wolf Crest",
  description: "Luxury curated residences for long term living",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ContactDock />
        <PosterPopup />
      </body>
    </html>
  );
}
