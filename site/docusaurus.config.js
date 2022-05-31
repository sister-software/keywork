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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightCodeTheme = require('prism-react-renderer/themes/okaidia')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkCodeTheme = require('prism-react-renderer/themes/okaidia')

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
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
            to: 'docs', // 'api' is the 'out' directory
            activeBasePath: 'docs',
            label: 'Documentation',
            position: 'left',
          },
          {
            href: 'https://github.com/nirrius/keywork', // 'api' is the 'out' directory
            label: 'Github',
            position: 'right',
          },
        ],
      },
      // navbar: {
      //   items: [
      //     {
      //       type: 'doc',
      //       docId: 'intro',
      //       position: 'left',
      //       label: 'Tutorial',
      //     },
      //     { to: '/blog', label: 'Blog', position: 'left' },
      //     {
      //       href: 'https://github.com/facebook/docusaurus',
      //       label: 'GitHub',
      //       position: 'right',
      //     },
      //   ],
      // },
      footer: {
        style: 'dark',
        links: [
          {
            title: "Cloudflare's Resources",
            items: [
              {
                label: 'Workers Docs',
                href: 'https://workers.cloudflare.com/',
              },
              {
                label: 'Discord',
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
                label: 'Blog',
                to: '/blog',
              },
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
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
