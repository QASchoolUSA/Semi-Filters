import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

// Load Inter via next/font — self-hosted at build time, zero render-blocking network request
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const BASE_URL = "https://semifilters.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Semi Filters",
  title: {
    default: "Semi Filters — Premium Filtration for Semi Trucks",
    template: "%s | Semi Filters",
  },
  description:
    "OEM-quality oil, air, fuel, and cabin filters for semi trucks. Trusted by owner-operators and fleets across the United States. Fast shipping. 100% satisfaction guarantee.",
  keywords: [
    "semi truck filters",
    "oil filters for semi trucks",
    "air filters for semi trucks",
    "fuel filters for semi trucks",
    "cabin air filters",
    "truck parts online",
    "fleet maintenance supplies",
    "OEM truck filters",
    "Freightliner filters",
    "Peterbilt filters",
    "Kenworth filters",
    "Volvo truck filters",
    "owner operator truck parts",
    "diesel engine filters",
    "heavy duty truck filters",
    "buy semi truck filters online",
  ],
  authors: [{ name: "Semi Filters", url: BASE_URL }],
  creator: "Semi Filters",
  publisher: "Semi Filters",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Semi Filters — Premium Filtration for Semi Trucks",
    description:
      "OEM-quality oil, air, fuel, and cabin filters for semi trucks. Trusted by owner-operators and fleets across the USA. Shop online with fast shipping.",
    type: "website",
    siteName: "Semi Filters",
    url: BASE_URL,
    locale: "en_US",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Semi Filters — Premium Filtration for Semi Trucks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Semi Filters — Premium Filtration for Semi Trucks",
    description:
      "OEM-quality oil, air, fuel, and cabin filters for semi trucks. Fast shipping, 100% satisfaction guarantee.",
    images: ["/icon-512.png"],
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
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#12121A",
    "geo.region": "US-FL",
    "geo.placename": "Sanford",
    "geo.position": "28.8003;-81.2731",
    "ICBM": "28.8003, -81.2731",
  },
  verification: {
    // Add your verification codes here after registering with each search console:
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // yandex: "YOUR_YANDEX_VERIFICATION_CODE",
    other: {
      "msvalidate.01": "",
    },
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Semi Filters",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      description:
        "Premium OEM-quality oil, air, fuel, and cabin filters for semi trucks. Serving owner-operators and fleets across the United States.",
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "Sanford",
        addressRegion: "FL",
        postalCode: "32771",
        addressCountry: "US",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+1-407-768-1488",
          email: "support@semifilters.com",
          availableLanguage: "English",
          hoursAvailable: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "07:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "08:00",
              closes: "14:00",
            },
          ],
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+1-407-768-1488",
          email: "support@semifilters.com",
          availableLanguage: "English",
        },
      ],
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      sameAs: [],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Semi Filters",
      url: BASE_URL,
      telephone: "+1-407-768-1488",
      email: "support@semifilters.com",
      image: `${BASE_URL}/icon-512.png`,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sanford",
        addressRegion: "FL",
        postalCode: "32771",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 28.8003,
        longitude: -81.2731,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "07:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "08:00",
          closes: "14:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Semi Truck Filters",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Oil Filters",
            itemListElement: [],
          },
          {
            "@type": "OfferCatalog",
            name: "Air Filters",
            itemListElement: [],
          },
          {
            "@type": "OfferCatalog",
            name: "Fuel Filters",
            itemListElement: [],
          },
          {
            "@type": "OfferCatalog",
            name: "Cabin Filters",
            itemListElement: [],
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Semi Filters",
      description:
        "Premium filtration solutions for semi trucks — oil, air, fuel, and cabin filters.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/shop?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
