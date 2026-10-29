import type { Metadata } from "next";
import { Suspense } from "react";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import PageLoader from "@/components/shared/PageLoader";
import { BrandingProvider } from "@/components/branding/BrandingProvider";
import { getPublicSiteConfig } from "@/services/doctor/clinicServices";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicSiteConfig();
  const brandName = config?.branding?.brandName || "Dr. Sarah's Care Chamber";
  const doctorTitle = config?.doctor?.title || "Senior Consultant Physician & Cardiologist";
  const doctorName = config?.doctor?.name || "Prof. Dr. Sarah Rahman";
  const tagline = config?.branding?.brandTagline || "Trusted Clinical Care & Preventive Health";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drsarahrahman.com";
  const description = `${doctorName} (${doctorTitle}) - ${tagline}. Book private chamber consultations, check real-time queue status, access digital prescriptions, and explore preventive healthcare services.`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${doctorName} | ${brandName}`,
      template: `%s | ${brandName}`,
    },
    description,
    keywords: [
      doctorName,
      brandName,
      "Doctor Appointment Dhaka",
      "Cardiologist Chamber",
      "Internal Medicine Specialist",
      "Digital Prescription Verification",
      "Online Doctor Consultation",
      "Care Medical Chamber",
      "Chamber Schedule & Slot Booking",
    ],
    authors: [{ name: doctorName, url: siteUrl }],
    creator: doctorName,
    publisher: brandName,
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${doctorName} | ${brandName}`,
      description,
      url: siteUrl,
      siteName: brandName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: `${doctorName} - Clinical Consultation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doctorName} | ${brandName}`,
      description,
      images: [
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    icons: {
      icon: config?.branding?.faviconUrl || "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getPublicSiteConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drsarahrahman.com";
  const doctorName = siteConfig?.doctor?.name || "Prof. Dr. Sarah Rahman";
  const brandName = siteConfig?.branding?.brandName || "Dr. Sarah's Care Chamber";

  // Schema.org Structured Data (Physician & MedicalClinic) for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctorName,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop",
    url: siteUrl,
    telephone: siteConfig?.contactPhone || "+8801700000000",
    medicalSpecialty: [
      "Cardiology",
      "Internal Medicine",
      "Preventive Healthcare",
    ],
    worksFor: {
      "@type": "MedicalClinic",
      name: brandName,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          siteConfig?.chambers?.[0]?.address ||
          "Dhanmondi Central Chamber",
        addressLocality: "Dhaka",
        postalCode: "1209",
        addressCountry: "BD",
      },
    },
    priceRange: "৳ - ৳৳",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dynamic theme color */}
        <meta
          name="theme-color"
          content={siteConfig?.branding?.primaryColor || "#0284c7"}
        />
        {/* Structured Data for SEO / Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${dmSans.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <BrandingProvider initialConfig={siteConfig}>
          <Suspense fallback={null}>
            <PageLoader />
          </Suspense>
          {children}
          <Toaster richColors position="top-right" />
        </BrandingProvider>
      </body>
    </html>
  );
}
