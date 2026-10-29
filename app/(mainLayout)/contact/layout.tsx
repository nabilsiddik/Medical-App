import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chamber Locations & Contact Info",
  description:
    "Get in touch with Prof. Dr. Sarah Rahman's clinic. Find chamber addresses, direct helpline numbers, WhatsApp booking assistance, and Google Maps directions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

