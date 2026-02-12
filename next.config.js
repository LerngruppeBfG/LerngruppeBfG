/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "LerngruppeBfG"
const isGitHubPages = process.env.GITHUB_PAGES === "true"
const isStaticExport = isGitHubPages || process.env.STATIC_EXPORT === "true"

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: "export" } : {}),
  basePath: isGitHubPages ? `/${repo}` : "",
  assetPrefix: isGitHubPages ? `/${repo}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [],
  },
}

module.exports = nextConfig
