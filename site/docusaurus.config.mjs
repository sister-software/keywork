/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import { createRequire } from 'module'
import { headingClasses } from './plugins/headingClasses.mjs'
import { polygotPlugin } from './plugins/polygot.mjs'
const require = createRequire(import.meta.url)

import { relativeLinks } from './plugins/relativeLinks.mjs'
const lightCodeTheme = require('prism-react-renderer/themes/okaidia')

/** @type {import('@docusaurus/preset-classic').Options} */
const presetOptions = {
  pages: false,

  docs: {
    path: '../docs',
    sidebarPath: './sidebars.cjs',
    routeBasePath: '/',
    editUrl: (params) => {
      const url = new URL(`https://github.com/nirrius/keywork/edit/main/${params.docPath}`)

      return url.toString()
    },
    showLastUpdateTime: true,
    remarkPlugins: [polygotPlugin],
    beforeDefaultRemarkPlugins: [headingClasses],
    rehypePlugins: [
      [
        relativeLinks,
        {
          domainRegex: /http[s]*:\/\/keywork\.app[/]?/,
        },
      ],
    ],
  },
  blog: false,
  theme: {
    customCss: [
      //
      require.resolve('./src/css/custom.css'),
      require.resolve('./src/css/fonts.css'),
      require.resolve('./src/css/backgrounds.css'),
      require.resolve('./src/css/scanline.css'),
      require.resolve('./src/css/navigation.css'),
      require.resolve('./src/css/scrollbar.css'),
      require.resolve('./src/css/sidebar.css'),
      require.resolve('./src/css/menu.css'),
      require.resolve('./src/css/cursor.css'),
    ],
  },
}

/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
const themeConfig = {
  algolia: {
    // The application ID provided by Algolia
    appId: '9JUUQPTSFR',

    // Public API key: it is safe to commit it
    apiKey: '44c9b523490600e3ea156373eeb11581',

    indexName: 'keywork',
    // contextualSearch: true,
    searchPagePath: false,
  },

  colorMode: {
    defaultMode: 'light',
    disableSwitch: true,
    respectPrefersColorScheme: false,
  },
  navbar: {
    hideOnScroll: true,
    title: 'Keywork',
    logo: {
      alt: 'Keywork Logo',
      src: 'img/logo.svg',
    },
    items: [
      {
        to: '/',
        activeBaseRegex: '^/$',
        label: 'What is Keywork?',
        position: 'left',
      },
      {
        to: 'examples/',
        activeBasePath: 'examples',
        label: 'Examples',
        position: 'left',
      },
      {
        to: 'modules/',
        activeBasePath: 'modules',
        label: 'Modules',
        position: 'left',
      },

      {
        to: 'contributing/',
        activeBasePath: 'contributing',
        label: 'Community',
        position: 'left',
      },

      {
        to: 'license/',
        activeBasePath: 'license',
        label: 'Licensing',
        position: 'left',
      },

      {
        href: 'https://github.com/nirrius/keywork',
        position: 'right',
        label: 'Github',
        className: 'link-with-icon icon-github',

        'aria-label': 'GitHub repository',
      },
    ],
  },
  footer: {
    style: 'dark',
    links: [
      {
        title: 'Resources',
        items: [
          {
            label: 'Modules',
            href: '/modules',
          },
          {
            label: 'Examples',
            href: '/examples',
          },
        ],
      },
      {
        title: 'Community',
        items: [
          {
            href: '/contributing',
            label: 'Contributing',
          },

          {
            href: 'https://github.com/nirrius/keywork',
            label: 'GitHub',
          },

          {
            href: 'https://github.com/nirrius/keywork/discussions',
            label: 'Forums',
          },

          {
            label: 'Help & Support',
            href: '/help',
          },
        ],
      },

      {
        title: 'License',
        items: [
          {
            href: '/license/',
            label: 'Overview',
          },

          {
            href: '/license/open-source',
            label: 'Open Source',
          },

          {
            href: '/license/commercial',
            label: 'Commercial Usage',
          },
        ],
      },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} Nirrius, LLC.`,
  },
  prism: {
    theme: lightCodeTheme,
    darkTheme: lightCodeTheme,
    additionalLanguages: ['toml'],
  },
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Keywork',
  tagline: 'A batteries-included library for building serverless web apps on Cloudflare Workers, Deno, and Node.JS',
  url: 'https://keywork.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nirrius', // Usually your GitHub org/user name.
  projectName: 'keywork', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [['classic', presetOptions]],
  themeConfig,
  scripts: [
    {
      src: '/scripts/main.mjs',
      async: true,
      defer: true,
      type: 'module',
    },
  ],
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/android-chrome-512x512.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/site.webmanifest',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#eaffff',
          },
        ],
      },
    ],
  ],
}

export default config
