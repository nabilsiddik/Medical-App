import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Services & Consultation Fees",
  description:
    "Explore specialized medical consultation services offered by Prof. Dr. Sarah Rahman, including cardiology evaluations, general medicine, and free report reviews.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Clinical Services & Consultation Fees | Dr. Sarah's Care Chamber",
    description:
      "Explore clinical consultation packages, transparent pricing, and comprehensive healthcare services.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

