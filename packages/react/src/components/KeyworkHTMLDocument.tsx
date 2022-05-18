import { KeyworkQueryParamKeys } from '@keywork/shared'
import classNames from 'classnames'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Helmet } from './helmet/Helmet'

export interface KeyworkHTMLDocumentProps {
  appContent: React.ReactElement
  location: URL
  moduleManifest?: string[]
  browserIdentifier?: string
  className?: string
  buildId?: string
}

/**
 * A server-side render of a given HTML document.
 *
 * @remark See
 */
export const KeyworkHTMLDocument: React.FC<KeyworkHTMLDocumentProps> = ({
  appContent,
  location,
  browserIdentifier,
  className,
  buildId,
}) => {
  const staticAppContent = renderToString(appContent)
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
        <div
          id="app-root"
          dangerouslySetInnerHTML={{
            __html: staticAppContent,
          }}
        />
        <div id="style-root" />
        <script type="module" src={`/index.js?${$assetSearchParams}`}></script>
      </body>
    </html>
  )
}
