import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment Online",
  description:
    "Schedule your chamber consultation with Prof. Dr. Sarah Rahman. Choose your preferred chamber location, select available time slots, and receive instant appointment confirmation.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book an Appointment Online | Dr. Sarah's Care Chamber",
    description:
      "Select your consultation service, choose your chamber, and reserve your doctor appointment slot online.",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

