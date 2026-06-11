import React from "react";
import type { Metadata } from "next";
import BlogContent from "@/app/blog/BlogContent";

export const metadata: Metadata = {
  title: "GlobeTrek Blog — Travel Tips, Guides & Flight Hacks",
  description:
    "Expert travel advice, destination guides, flight tips, and booking strategies to help you explore the world for less.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "GlobeTrek Blog — Travel Inspiration & Expert Advice",
    description:
      "Unlock cheaper flights, luxury stays on a budget, and discover hidden gems around the world with our team of travel writers.",
    url: "https://globetrek.com/blog",
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
