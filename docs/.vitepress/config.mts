/**
 * VitePress config. This repo is not `"type": "module"`, so the config must use
 * the `.mts` extension (ESM TypeScript). If you add `"type": "module"` to the
 * root package.json, you can rename this file to `config.ts`.
 */
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'ChaosToggle.js',
  description: 'Drop-in visual chaos & prank effects for the web',
  base: '/ChaosToggle.js/',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: 'Live Demo', link: '/demo/' },
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Effects', link: '/guide/effects' },
      { text: 'Themes', link: '/guide/themes' },
      { text: 'API', link: '/api/' },
      { text: 'Contributing', link: '/community/contributing' },
    ],

    sidebar: {
      '/demo/': [
        {
          text: 'Live Demos',
          items: [
            { text: 'Playground', link: '/demo/' },
            { text: 'E-commerce Store', link: '/demo/store' },
            { text: 'Dashboard', link: '/demo/dashboard' },
            { text: 'Blog / News', link: '/demo/blog' },
            { text: 'Corporate Landing', link: '/demo/corporate' },
          ],
        },
      ],
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Effects', link: '/guide/effects' },
            { text: 'Themes', link: '/guide/themes' },
            { text: 'Modes', link: '/guide/modes' },
            { text: 'Control Panel', link: '/guide/panel' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Plugin API', link: '/api/plugin-api' },
            { text: 'TypeScript types', link: '/api/types' },
          ],
        },
      ],
      '/community/': [
        {
          text: 'Community',
          items: [
            { text: 'Contributing', link: '/community/contributing' },
            { text: 'Effect template', link: '/community/effect-template' },
            { text: 'Theme template', link: '/community/theme-template' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Caripson/ChaosToggle.js' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © present Caripson',
    },

    search: {
      provider: 'local',
    },
  },
});
