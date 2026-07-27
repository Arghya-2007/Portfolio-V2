import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/lib/lenis/LenisProvider";
import CustomCursor from "@/components/layout/CustomCursor";
import SiteEntryLoader from "@/components/layout/SiteEntryLoader";
import BackgroundParticles from "@/components/layout/BackgroundParticles";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Arghya Pal - Portfolio",
  description: "Aspiring MLOps & AI Infra Engineer / Full-Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arghya Pal",
    url: "https://portfolio.devarghya.in",
    jobTitle: "Aspiring MLOps & AI Infra Engineer",
    description: "Aspiring MLOps & AI Infra Engineer / Full-Stack Developer based in Kolkata, India.",
    sameAs: [
      "https://github.com/Arghya-2007",
      "https://www.linkedin.com/in/arghya-pal-2b866038b/",
      "https://www.instagram.com/its_arghya_pal/",
      "https://www.facebook.com/argha.pal.9699/"
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Techno Main Salt Lake"
    }
  };

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} font-body bg-bg-primary text-text-primary antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteEntryLoader />
        <BackgroundParticles />
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
