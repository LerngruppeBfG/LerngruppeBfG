/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/Lerngruppe26",
  assetPrefix: "/Lerngruppe26/",
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [],
  },
}

module.exports = nextConfig
