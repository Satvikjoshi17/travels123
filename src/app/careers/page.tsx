import React from "react";
import type { Metadata } from "next";
import CareersContent from "@/app/careers/CareersContent";

export const metadata: Metadata = {
  title: "Careers at GlobeTrek — Join Our Remote-First Team",
  description:
    "Explore open positions, check out our core company values, and find out how we work at GlobeTrek to redefine travel search globally.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at GlobeTrek — Help Us Rebuild Travel Booking",
    description:
      "Join a passionate, remote-first global team building AI-driven solutions that help millions of travelers save time and money.",
    url: "https://globetrek.com/careers",
  },
};

export default function CareersPage() {
  return <CareersContent />;
}
