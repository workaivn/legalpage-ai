import type { Metadata } from "next";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "LegalPage AI - AI Legal Page Generator SaaS",
    template: "%s | LegalPage AI",
  },
  description:
    "A marketplace-ready SaaS app for generating, saving, editing, and exporting AI-assisted legal pages for SaaS, apps, ecommerce, agencies, blogs, and AI tools.",
  openGraph: {
    title: "LegalPage AI - AI Legal Page Generator",
    description: "Generate Privacy Policy, Terms, Cookie Policy, Refund Policy, GDPR notices, DPA, AI usage policy, and more.",
    url: "/",
    siteName: "LegalPage AI",
    type: "website",
    images: [
      {
        url: "/brand/social-preview.png",
        width: 1200,
        height: 630,
        alt: "LegalPage AI social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LegalPage AI",
    description: "Premium AI legal page generator SaaS for makers and founders.",
    images: ["/brand/social-preview.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/app-icon.png",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "LegalPage AI",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "49", priceCurrency: "USD" },
              description: metadata.description,
            }),
          }}
        />
        <DemoModeBanner />
        {children}
      </body>
    </html>
  );
}
