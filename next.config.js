/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "Lerngruppe26"
const isGitHubPages = process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_PAGES === "true"

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isGitHubPages ? `/${repo}` : "",
  assetPrefix: isGitHubPages ? `/${repo}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [],
  },
}

module.exports = nextConfig
