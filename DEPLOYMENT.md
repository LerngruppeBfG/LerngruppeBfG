# Deployment Guide

This document explains how to deploy the LerngruppeBfG website to GitHub Pages.

## Prerequisites

The repository is already configured for deployment with:
- ✅ GitHub Actions workflow (`.github/workflows/nextjs.yml`)
- ✅ Next.js static export configuration (`next.config.js`)
- ✅ Automatic repository name detection

## Enabling GitHub Pages Deployment

Follow these steps to enable GitHub Pages for this repository:

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository: https://github.com/LerngruppeBfG/LerngruppeBfG
2. Click on **Settings** (at the top navigation bar)
3. In the left sidebar, click on **Pages** (under "Code and automation")
4. Under **Source**, select **GitHub Actions**
5. The page will automatically save your selection

### 2. Trigger the Deployment

The deployment will automatically trigger when:
- You push changes to the `main` branch
- You manually trigger the workflow from the Actions tab

To manually trigger the deployment:
1. Go to the **Actions** tab in your repository
2. Select the **"Deploy Next.js site to Pages"** workflow
3. Click **"Run workflow"** button
4. Select the `main` branch
5. Click **"Run workflow"**

### 3. Wait for Deployment to Complete

1. Go to the **Actions** tab to monitor the deployment progress
2. The workflow has two jobs:
   - **Build**: Builds the Next.js site with static export
   - **Deploy**: Deploys the built site to GitHub Pages
3. Wait for both jobs to complete successfully (green checkmark)

### 4. Access Your Deployed Website

Once deployment is complete, your website will be available at:

```
https://lerngruppebfg.github.io/LerngruppeBfG/
```

## Environment Variables

If your application requires environment variables (e.g., Supabase credentials, API keys), you need to add them as GitHub Secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add each required secret:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (if using ChatGPT)
   - `ANTHROPIC_API_KEY` (if using Claude)
   - etc.

Then update `.github/workflows/nextjs.yml` to include these secrets in the build step:

```yaml
- name: Build with Next.js
  run: ${{ steps.detect-package-manager.outputs.runner }} next build
  env:
    GITHUB_PAGES: "true"
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    # Add other secrets as needed
```

**Note**: Only `NEXT_PUBLIC_*` environment variables are included in the client-side bundle. Server-side API keys will not work in GitHub Pages as it's a static site.

## Troubleshooting

### Deployment Fails

1. Check the Actions tab for error messages
2. Ensure all dependencies are correctly specified in `package.json`
3. Verify the build works locally: `npm run build`

### Website Shows 404 Errors

1. Verify GitHub Pages is enabled and set to "GitHub Actions" source
2. Check that the deployment job completed successfully
3. Ensure the URL includes the repository name: `/LerngruppeBfG/`

### Styles or Images Missing

1. Ensure `next.config.js` has correct `basePath` and `assetPrefix` configuration
2. The workflow sets `GITHUB_PAGES=true` which activates the correct paths
3. Images must use the `unoptimized: true` setting (already configured)

### Admin Page Not Working

The admin page is intentionally disabled on GitHub Pages for security reasons. It only works when running locally with `npm run dev`.

## Local Development

To test the site locally before deployment:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build and test static export locally
GITHUB_PAGES=true npm run build
npx serve out
```

## Additional Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
