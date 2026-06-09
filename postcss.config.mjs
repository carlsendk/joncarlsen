// Tailwind 4 via PostCSS. Astro auto-loads this config and runs it through
// Vite's CSS pipeline. Tailwind 4 detects template sources automatically, so
// unused utilities are purged from the production build (ADR-005).
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
