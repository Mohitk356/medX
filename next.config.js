/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "storage.googleapis.com",
      "firebasestorage.googleapis.com",
      "cdn.shopify.com",
      "upload.wikimedia.org",
      "www.medxpharmacy.com",
      "gympower.co.uk"
    ],
  },
  webpack: (config) => {
    let modularizeImports = null;
    config.module.rules.some((rule) =>
      rule.oneOf?.some((oneOf) => {
        modularizeImports = oneOf?.use?.options?.nextConfig?.modularizeImports;
        return modularizeImports;
      })
    );
    if (modularizeImports?.["@headlessui/react"])
      delete modularizeImports["@headlessui/react"];
    return config;
  },
};

module.exports = nextConfig;
