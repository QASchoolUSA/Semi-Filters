import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
