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

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// eslint-disable-next-line import/extensions
import docsPlugin from '@docusaurus/plugin-content-docs'
import { createRequire } from 'module'
import { readAllPackageEntryPoints } from '../build/utils/packages.mjs'
import { typeDocPlugin } from './typedoc/index.mjs'

const allPackageEntryPoints = await readAllPackageEntryPoints()
const require = createRequire(import.meta.url)
const lightCodeTheme = require('prism-react-renderer/themes/okaidia')
const validationUtils = require('@docusaurus/utils-validation')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Keywork',
  tagline: 'A batteries-included, magic-free, library for building web apps on Cloudflare Workers.',
  url: 'https://keywork.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: false,
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
      },
    ],
  ],
  plugins: [
    [
      typeDocPlugin,
      {
        typeDocOptions: {
          entryPoints: allPackageEntryPoints,
          githubPages: false,
          excludeInternal: true,
          hideGenerator: true,
          hideBreadcrumbs: true,
          hideInPageTOC: true,
        },
      },
    ],
    [
      docsPlugin.default,
      docsPlugin.validateOptions({
        validate: validationUtils.normalizePluginOptions,
        options:
          /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
          {
            id: 'docs',
            path: 'docs',
            routeBasePath: '/docs',
          },
      }),
    ],

    [
      docsPlugin.default,
      docsPlugin.validateOptions({
        validate: validationUtils.normalizePluginOptions,
        options:
          /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
          {
            id: 'licensing',
            path: 'licensing',
            routeBasePath: '/licensing',
          },
      }),
    ],

    // [
    //   '@docusaurus/plugin-content-docs',
    //   /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
    //   ({
    //     id: 'docs-modules',
    //     path: 'api',
    //     routeBasePath: '/api',
    //   }),
    // ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Keywork',
        logo: {
          alt: 'Keywork Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: 'docs/overview/',
            activeBasePath: 'docs',
            label: 'Documentation',
            position: 'left',
          },
          {
            to: 'api/modules/',
            activeBasePath: 'api',
            label: 'API Reference',
            position: 'left',
          },
          {
            to: 'licensing/overview/',
            activeBasePath: 'licensing',
            label: 'Licensing',
            position: 'left',
          },

          {
            href: 'https://github.com/nirrius/keywork', // 'api' is the 'out' directory
            label: 'Github',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'External Resources',
            items: [
              {
                label: 'Official Cloudflare Workers Docs',
                href: 'https://workers.cloudflare.com/',
              },
              {
                label: "Cloudflare's Developer Discord",
                href: 'https://discord.gg/cloudflaredev',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/keywork',
              },
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/docusaurus',
              // },
              {
                label: 'Twitter',
                href: 'https://twitter.com/nirrius',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/nirrius/keywork',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nirrius, LLC.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: lightCodeTheme,
      },
    },
}

export default config
