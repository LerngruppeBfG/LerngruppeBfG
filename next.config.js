/** @type {import('next').NextConfig} */
const repo = "Lerngruppe26"
const isGithubPages = process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_PAGES === "true"

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isGithubPages ? `/${repo}` : "",
  assetPrefix: isGithubPages ? `/${repo}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [],
  },
}

module.exports = nextConfig
