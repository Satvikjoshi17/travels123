import React from 'react';
import Link from 'next/link';
import type { Metadata } from "next";
import AboutContent from '@/app/about/AboutContent';

export const metadata: Metadata = {
  title: "About Us — Our Story & Mission",
  description:
    "Learn about GlobeTrek — the AI-powered travel aggregator searching 100+ sites to find you the cheapest flights, hotels & travel deals worldwide.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About GlobeTrek — Redefining Travel Search",
    description:
      "Discover how GlobeTrek uses AI to compare 100+ travel sites and save you money on every trip.",
    url: "https://globetrek.com/about",
  },
};

export default function AboutUs() {
  return <AboutContent />;
}
