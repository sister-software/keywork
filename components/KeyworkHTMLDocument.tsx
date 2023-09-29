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

import classNames from 'classnames'
import { IsomorphicFetchEvent } from 'keywork/events'
import { FC, ReactNode } from 'react'

/**
 * The default ID assigned to the React root element.
 *
 * ```tsx
 * <div id={KeyworkHTMLDocumentAppRoot}>{children}</div>
 * ```
 * @ignore
 */
export const KeyworkHTMLDocumentAppRoot = 'app-root'

/**
 * The default ID assigned to the React root style element.
 *
 * ```tsx
 * <div id={KeyworkHTMLDocumentStyleRoot}>{children}</div>
 * ```
 * @ignore
 */
export const KeyworkHTMLDocumentStyleRoot = 'style-root'

export enum KeyworkQueryParamKeys {
  /** The current build ID. Used to bust caches on static assets. */
  BuildID = 'build-id',
  /**
   * A boolean-like query param that hints to the worker that client-side React
   * only needs the static props for an upcoming page transition.
   */
  StaticProps = 'static-props',
}

export interface KeyworkHTMLDocumentProps {
  moduleManifest?: string[]
  browserIdentifier?: string
  className?: string
  buildId?: string
  event?: IsomorphicFetchEvent<any, any, any>
  children: ReactNode
}

export type KeyworkHTMLDocumentComponent = FC<KeyworkHTMLDocumentProps>

/**
 * A server-side render of a given HTML document.
 *
 */
export const KeyworkHTMLDocument: KeyworkHTMLDocumentComponent = ({
  children,
  browserIdentifier,
  className,
  buildId,
  event,
}) => {
  /** Added to trigger cache busting. */
  const assetSearchParams = new URLSearchParams({
    [KeyworkQueryParamKeys.BuildID]: buildId || 'development',
  })

  const $assetSearchParams = assetSearchParams.toString()

  const document = event?.document || {}
  const charSet = document.charSet || 'utf-8'
  const documentTitle = document.title || 'Keywork App'
  const lang = document.lang || document.htmlAttributes?.lang || 'en'

  return (
    <html
      lang={lang}
      className={classNames('static', className)}
      data-browser={browserIdentifier}
      {...document.htmlAttributes}
    >
      <head>
        <meta charSet={charSet} />
        <title>{documentTitle}</title>
        <meta property="og:title" content={documentTitle} />
        <meta name="twitter:title" content={documentTitle} />

        {document.meta}

        {document.themeColor ? <meta name="theme-color" content={document.themeColor} /> : null}

        {document.keywords ? <meta name="keywords" content={document.keywords.join(', ')} /> : null}

        {document.linkingData ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(document.linkingData),
            }}
          />
        ) : null}

        {document.siteName ? <meta property="og:site_name" content={document.siteName} /> : null}
        {document.siteURL ? <meta property="og:url" content={document.siteURL} /> : null}

        {document.description ? (
          <>
            <meta name="description" content={document.description} />
            <meta property="og:description" content={document.description} />
            <meta name="twitter:description" content={document.description} />
          </>
        ) : null}

        {document.image ? (
          <>
            <meta key="twitter:image" name="twitter:image" content={document.image.url} />,
            <meta key="og:image" property="og:image" content={document.image.url} />,
            {document.image.height ? (
              <meta key="og:image:height" property="og:image:height" content={document.image.height.toString()} />
            ) : null}
            {document.image.width ? (
              <meta key="og:image:width" property="og:image:width" content={document.image.width.toString()} />
            ) : null}
          </>
        ) : null}
        {document.author ? <meta name="author" content={document.author} /> : null}

        {document.link}

        {document.importMap ? (
          <script
            type="importmap"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(document.importMap, null, 2),
            }}
          />
        ) : null}

        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('static')`,
          }}
        />

        {document.style}
        {document.script}
      </head>
      <body>
        <div id={KeyworkHTMLDocumentAppRoot}>{children}</div>
        <div id={KeyworkHTMLDocumentStyleRoot} />

        {document.omitHydrationScript ? null : <script type="module" src={`/main.js?${$assetSearchParams}`}></script>}
      </body>
    </html>
  )
}
