import type { Metadata } from "next";
import { Newsreader, Public_Sans, Amiri } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thehadithproject.com"),
  title: {
    default: "The Hadith Project",
    template: "%s · The Hadith Project",
  },
  description:
    "Open, verifiable infrastructure for hadith and its sciences: one stable reference for every narration, every narrator's record, and every scholar's verdict with its reasons.",
  openGraph: {
    siteName: "The Hadith Project",
    type: "website",
    url: "https://thehadithproject.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable} ${amiri.variable}`}>
      <body>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
