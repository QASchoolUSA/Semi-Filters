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

export const metadata: Metadata = {
  title: "Semi Filters — Premium Filtration for Semi Trucks",
  description:
    "OEM-quality oil, air, fuel, and cabin filters for semi trucks. Trusted by owner-operators and fleets across the nation. Shop online with fast shipping.",
  keywords: [
    "semi truck filters",
    "oil filters",
    "air filters",
    "fuel filters",
    "cabin filters",
    "truck parts",
    "fleet maintenance",
  ],
  openGraph: {
    title: "Semi Filters — Premium Filtration for Semi Trucks",
    description:
      "OEM-quality filtration solutions for semi trucks. Keep your fleet running clean and efficient.",
    type: "website",
    siteName: "Semi Filters",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#12121A",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
