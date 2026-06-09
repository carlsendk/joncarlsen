// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Tailwind 4 is wired via PostCSS (postcss.config.mjs) rather than the
// @tailwindcss/vite plugin, to avoid a Vite major-version skew between Astro 5
// (vite 6) and the Tailwind Vite plugin (vite 8). See ADR-005.
export default defineConfig({
  // Custom domain on GitHub Pages — served at the root (ADR-006).
  site: 'https://joncarlsen.dk',
  base: '/',
});
