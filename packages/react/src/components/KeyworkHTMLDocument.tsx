import { KeyworkQueryParamKeys } from '@keywork/shared'
import classNames from 'classnames'
import React from 'react'
import { Helmet } from './helmet/Helmet'

export interface KeyworkHTMLDocumentProps {
  location: URL
  moduleManifest?: string[]
  browserIdentifier?: string
  className?: string
  buildId?: string
  children: React.ReactNode
}

/**
 * A server-side render of a given HTML document.
 *
 */
export const KeyworkHTMLDocument: React.FC<KeyworkHTMLDocumentProps> = ({
  children,
  location,
  browserIdentifier,
  className,
  buildId,
}) => {
  const helmetData = Helmet.renderStatic()

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
    >
      <head>
        <meta charSet="utf-8" />
        {helmetData.title.toComponent()}

        {helmetData.meta.toComponent()}
        {helmetData.link.toComponent()}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.remove('static')
            `,
          }}
        />

        {helmetData.style.toComponent()}
        {helmetData.script.toComponent()}
      </head>
      <body>
        <div id="app-root">{children}</div>
        <div id="style-root" />
        <script type="module" src={`/index.js?${$assetSearchParams}`}></script>
      </body>
    </html>
  )
}
