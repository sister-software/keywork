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

import { HtmlHTMLAttributes } from 'react'
import { ImportMap } from '../files/index.js'

/**
 * Props related to rendering HTML document.
 *
 * Note that this only applies to HTML responses that do not override
 * Keywork's default HTML document.
 *
 * @see {@linkcode KeyworkHTMLDocument}
 */
export interface SSRDocument {
  /** Document title. */
  title?: string

  /**
   * The character set to use for the document.
   * @default "utf-8"
   */
  charSet?: string

  /**
   * Description applied to the document's meta description tag, as well as
   * OpenGraph and Twitter cards.
   */
  description?: string

  /**
   * The canonical name of the site, e.g. "Acme Inc.".
   */
  siteName?: string

  /**
   * The canonical URL of the site, e.g. "https://acme.com".
   */
  siteURL?: string

  /**
   * The author of the document.
   */
  author?: string

  /**
   * The keywords applied to the document's meta keywords tag.
   */
  keywords?: string[]

  /**
   * JSON-LD serializeable data to be embedded in the document.
   *
   * This is used to embed structured data in the document, such as
   * [JSON-LD](https://json-ld.org/).
   */
  linkingData?: {}

  /**
   * The image to use for OpenGraph and Twitter cards.
   */
  image?: DocumentImage

  /**
   * The primary color of the application. This is used to set the theme color
   * in the document's `<head>`.
   */
  themeColor?: string

  /** Optional `<meta>` tags */
  meta?: React.ReactNode

  /** Optional `<link>` tags */
  link?: React.ReactNode

  /** Optional `<style>` tags */
  style?: React.ReactNode

  /** Optional `<script>` tags */
  script?: React.ReactNode

  /**
   * The language of the document.
   * @default "en"
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang | MDN}
   */
  lang?: string

  htmlAttributes?: HtmlHTMLAttributes<HTMLHtmlElement>

  /**
   * A map of module specifiers to URLs to use for importing modules.
   *
   * This is useful when you want to use a CDN to serve your modules.
   */
  importMap?: ImportMap

  /**
   * Whether to omit the React hydration script from the document.
   * This is useful when you want to render a static HTML page.
   *
   * @default false
   */
  omitHydrationScript?: boolean
}

export interface DocumentImage {
  width?: number
  height?: number
  url: string
}
