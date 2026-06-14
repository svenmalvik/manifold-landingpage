// @ts-check
import { defineConfig } from 'astro/config'

// Custom domain (manifold.no) served from the site root, so no `base` path.
export default defineConfig({
  site: 'https://manifold.no',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
})
