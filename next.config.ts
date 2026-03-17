import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const slugRedirects: [string, string][] = [
  ["21707132-by-pass-oil-filter", "volvo-21707132-bypass-oil-filter"],
  ["23151592-oil-filter", "volvo-23151592-oil-filter"],
  ["23658092-long-life-oil-filter", "volvo-23658092-long-life-oil-filter"],
  ["23920469-fuel-filter", "volvo-23920469-fuel-filter"],
  ["fs19764-fuel-water-separator", "fs19764-volvo-mack-fuel-water-separator"],
  ["fs19765-fuel-water-separator", "fs19765-kenworth-fuel-water-separator"],
  ["fs19915-fuel-filter-with-water-separator", "fs19915-freightliner-fuel-water-separator"],
  ["fs20313-fuel-water-separator", "fs20313-volvo-mack-fuel-water-separator"],
  ["0342776010-air-filter", "03-42776-010-freightliner-cascadia-air-filter"],
  ["21715813-air-filter", "volvo-21715813-air-filter"],
  ["af26163m-air-filter", "af26163m-volvo-vnl-air-filter"],
  ["af27879-air-filter", "af27879-freightliner-air-filter"],
  ["kenworth-air-filter-d371061", "d371061-kenworth-peterbilt-air-filter"],
  ["p611696-air-filter", "p611696-kenworth-air-filter"],
  ["p621725-engine-air-filter", "p621725-kenworth-peterbilt-air-filter"],
  ["volvo-vnl-engine-filter-kit-d13-21707132-2x23658092-2390469", "volvo-vnl-d13-engine-filter-kit"],
  ["volvo-vnl-d12-d13-fs20313-23920469-23151592x2-fuel-and-oil-filter-change-kit", "volvo-vnl-fuel-oil-filter-change-kit"],
  ["volvo-vnl-d12-d13-oil-filter-change-kit-21707132-23658092", "volvo-vnl-oil-filter-change-kit"],
  ["volvo-vnl-engine-filter-change-kit-d12-d13-21707132-23658092-2390469-fs19765", "volvo-vnl-complete-engine-filter-kit"],
  ["volvo-vnl-fuel-and-oil-filter-change-kit-fs20313-23151592", "volvo-vnl-fuel-oil-service-kit"],
  ["fuel-oil-filter-change-kit-for-volvo-vnl-d12-d13-23920469-23151592", "volvo-vnl-d13-fuel-oil-filter-kit"],
  ["truck-lamp-60250r-red-led", "60250r-red-led-truck-lamp"],
  ["truck-lamp-6060c-white-led", "6060c-white-led-truck-backup-lamp"],
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return slugRedirects.map(([oldSlug, newSlug]) => ({
      source: `/shop/${oldSlug}`,
      destination: `/shop/${newSlug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
