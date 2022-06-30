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
import { KeyworkHTMLDocumentAppRoot, KeyworkHTMLDocumentStyleRoot } from 'keywork/react/common'
import { KeyworkQueryParamKeys } from 'keywork/utilities'
import type { FC, HtmlHTMLAttributes, ReactFragment, ReactNode } from 'react'

export interface KeyworkHTMLDocumentProps {
  moduleManifest?: string[]
  browserIdentifier?: string
  className?: string
  buildId?: string
  children: ReactNode
  /** Document title. */
  title?: string
  /** Optional `<meta>` tags */
  meta?: ReactFragment
  /** Optional `<link>` tags */
  link?: ReactFragment
  /** Optional `<style>` tags */
  style?: ReactFragment
  /** Optional `<script>` tags */
  script?: ReactFragment

  htmlAttributes?: HtmlHTMLAttributes<HTMLHtmlElement>
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
        <div id={KeyworkHTMLDocumentAppRoot}>{children}</div>
        <div id={KeyworkHTMLDocumentStyleRoot} />

        <script type="module" src={`/main.js?${$assetSearchParams}`}></script>
      </body>
    </html>
  )
}
