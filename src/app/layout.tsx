import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import {
  WebsiteStructuredData,
  OrganizationStructuredData,
  FAQStructuredData,
} from "./structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "GlobeTrek — Compare Cheap Flights, Hotels & Travel Deals",
    template: "%s | GlobeTrek",
  },
  description:
    "Search & compare 100+ travel sites instantly. Find the cheapest flights, hotels, holiday packages & bus tickets. Best prices guaranteed. Save up to 40% on every trip.",
  keywords: [
    "cheap flights",
    "hotel deals",
    "flight comparison",
    "travel aggregator",
    "best flight prices",
    "hotel booking",
    "holiday packages",
    "bus tickets",
    "travel deals India",
    "compare flights",
    "cheapest hotels",
    "travel search engine",
  ],
  authors: [{ name: "GlobeTrek" }],
  creator: "GlobeTrek",
  publisher: "GlobeTrek",
  metadataBase: new URL("https://globetrek.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://globetrek.com",
    siteName: "GlobeTrek",
    title: "GlobeTrek — Your Smartest Way to Travel",
    description:
      "Compare 100+ travel sites in seconds. Find cheapest flights, hotels & holiday packages.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GlobeTrek — Compare Travel Deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobeTrek — Compare Cheap Flights & Hotels",
    description:
      "Search 100+ travel sites. Best prices on flights, hotels & packages.",
    images: ["/og-image.jpg"],
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
  // Add your Google Search Console verification code here after setup
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <FAQStructuredData />
        <script
          {...{ nowprocket: "", "seraph-accel-crit": "1" }}
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          data-no-defer="1"
          dangerouslySetInnerHTML={{
            __html: `
  (function () {
      var script = document.createElement("script");
      script.async = 1;
      script.src = 'https://emrldtp.cc/NTM0NDcw.js?t=534470';
      document.head.appendChild(script);
  })();`
          }}
        />
        <link href="https://fonts.cdnfonts.com/css/metropolis" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          /* Custom Premium Dark Scrollbar */
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}} />
      </head>
      <body className={`${inter.variable} bg-background text-on-surface antialiased overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
