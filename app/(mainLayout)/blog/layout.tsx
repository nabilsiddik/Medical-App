import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Insights & Medical Blog",
  description:
    "Evidence-based articles, cardiology wellness tips, hypertension prevention, and healthy lifestyle advice written by clinical medical specialists.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

