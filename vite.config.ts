import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const seoPlugin = () => {
  return {
    name: 'seo-plugin',
    transformIndexHtml(html: string, ctx: any) {
      const baseUrl = process.env.CUSTOM_DOMAIN || 'https://cordlesstoolz.com';
      let currentPath = ctx.originalUrl || '/';
      currentPath = currentPath.split('?')[0];
      if (currentPath !== '/' && currentPath.endsWith('/')) {
         currentPath = currentPath.slice(0, -1);
      }
      const canonicalUrl = `${baseUrl}${currentPath}`;
      const seoTags = `
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="${canonicalUrl}" />
      `;
      return html.replace('<!-- __SEO_INJECTION__ -->', seoTags);
    }
  }
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), seoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
