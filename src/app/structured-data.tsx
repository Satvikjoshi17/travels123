// JSON-LD Structured Data for Google Rich Results
// This tells Google exactly what GlobeTrek is — improves ranking

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GlobeTrek",
    alternateName: "GlobeTrek Travel Search",
    url: "https://globetrek.com",
    description:
      "Search & compare 100+ travel sites. Find cheapest flights, hotels & holiday packages.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://globetrek.com/search-results?type=flights&to={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GlobeTrek",
    url: "https://globetrek.com",
    description:
      "AI-powered travel meta-search engine comparing 100+ sites for best prices.",
    foundingDate: "2026",
    sameAs: [
      // Add your social media links here when you have them
      // "https://twitter.com/globetrek",
      // "https://instagram.com/globetrek",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function FAQStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does GlobeTrek find cheap flights?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GlobeTrek searches 100+ travel sites simultaneously to compare prices and find you the cheapest flights, hotels, and travel deals in seconds.",
        },
      },
      {
        "@type": "Question",
        name: "Is GlobeTrek free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! GlobeTrek is completely free. We compare prices across 100+ travel sites and redirect you to book directly with the provider.",
        },
      },
      {
        "@type": "Question",
        name: "Does GlobeTrek sell tickets directly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, GlobeTrek is a meta-search engine. We compare prices and redirect you to the travel provider (like MakeMyTrip, Booking.com, Expedia) to complete your booking.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
