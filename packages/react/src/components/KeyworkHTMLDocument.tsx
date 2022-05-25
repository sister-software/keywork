import { KeyworkQueryParamKeys } from '@keywork/utils'
import classNames from 'classnames'
import React from 'react'

export interface KeyworkHTMLDocumentProps {
  location: URL
  moduleManifest?: string[]
  browserIdentifier?: string
  className?: string
  buildId?: string
  children: React.ReactNode
  /** Document title. */
  title?: string
  /** Optional `<meta>` tags */
  meta?: React.ReactFragment
  /** Optional `<link>` tags */
  link?: React.ReactFragment
  /** Optional `<style>` tags */
  style?: React.ReactFragment
  /** Optional `<script>` tags */
  script?: React.ReactFragment

  htmlAttributes?: React.HtmlHTMLAttributes<HTMLHtmlElement>
}

export type KeyworkHTMLDocumentComponent = React.FC<KeyworkHTMLDocumentProps>

/**
 * A server-side render of a given HTML document.
 *
 */
export const KeyworkHTMLDocument: KeyworkHTMLDocumentComponent = ({
  children,
  location,
  browserIdentifier,
  className,
  buildId,
  htmlAttributes,
  title = 'Keywork App',
  meta,
  link,
  style,
  script,
}) => {
  /** Added to trigger cache busting. */
  const assetSearchParams = new URLSearchParams({
    [KeyworkQueryParamKeys.BuildID]: buildId || 'development',
  })

  const $assetSearchParams = assetSearchParams.toString()

  return (
    <html
      lang="en-US"
      className={classNames('static has-pointer', className)}
      data-browser={browserIdentifier}
      data-route={location.pathname || '/'}
      {...htmlAttributes}
    >
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>

        {meta}
        {link}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.remove('static')
            `,
          }}
        />

        {style}
        {script}
      </head>
      <body>
        <div id="app-root">{children}</div>
        <div id="style-root" />

        <script type="module" src={`/index.js?${$assetSearchParams}`}></script>
      </body>
    </html>
  )
}
