import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function normalizeSiteUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim()
  if (!trimmed) return undefined
  return trimmed.replace(/\/$/, '')
}

function siteSeoPlugin(siteUrl: string | undefined): Plugin {
  return {
    name: 'site-seo',
    transformIndexHtml(html) {
      if (!siteUrl) return html

      const absoluteOgImage = `${siteUrl}/og-image.svg`

      return html
        .replace(
          '</head>',
          `    <link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />\n  </head>`,
        )
        .replaceAll('content="/og-image.svg"', `content="${absoluteOgImage}"`)
    },
    closeBundle() {
      if (!siteUrl) return

      const dist = resolve(__dirname, 'dist')

      writeFileSync(
        resolve(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      )

      writeFileSync(
        resolve(dist, 'robots.txt'),
        `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
      )
    },
  }
}

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL)

export default defineConfig({
  plugins: [react(), tailwindcss(), siteSeoPlugin(siteUrl)],
  server: {
    proxy: {
      '/api/kaggle': {
        target: 'https://www.kaggle.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kaggle/, ''),
      },
    },
  },
})
