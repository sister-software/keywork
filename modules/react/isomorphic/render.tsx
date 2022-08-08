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

import {
  ReactRendererOptions,
  ReactRenderStreamResult,
  SSRPropsLike,
  StaticPropsProvider,
} from 'keywork/react/isomorphic'
import { Logger } from 'keywork/logger'
import React, { ReactElement } from 'react'
import { ReactDOMServerReadableStream } from 'react-dom/server.browser'
import { KeyworkHTMLDocument } from './KeyworkHTMLDocument.tsx'
import { KeyworkProviders } from './KeyworkProvidersComponent.tsx'
import { _SSRPropsEmbed } from './SSRPropsEmbed.tsx'
import { KeyworkResourceError } from 'keywork/errors'
import { renderReactStream } from '../worker/stream.ts'
/**
 * Renders the given React content to an HTML stream.
 * @ignore
 */
export async function renderJSXToStream<StaticProps extends SSRPropsLike | null = null>(
  /** The React component to render for this specific page. */
  pageElement: ReactElement<StaticProps>,
  reactRenderOptions?: ReactRendererOptions
): Promise<ReactDOMServerReadableStream> {
  const logger = new Logger('react Stream Renderer')

  const streamRenderer = reactRenderOptions?.streamRenderer || renderReactStream
  const DocumentComponent = reactRenderOptions?.DocumentComponent || KeyworkHTMLDocument
  const Providers = reactRenderOptions?.Providers || KeyworkProviders

  const staticProps = pageElement.props

  const appDocument = (
    <StaticPropsProvider staticProps={staticProps!}>
      <Providers>
        <DocumentComponent>
          {pageElement}
          <_SSRPropsEmbed staticProps={staticProps} />
        </DocumentComponent>
      </Providers>
    </StaticPropsProvider>
  )

  let result: ReactRenderStreamResult

  try {
    result = await streamRenderer(appDocument)
  } catch (error) {
    logger.error(error)
    throw new KeyworkResourceError(
      'An runtime error occurred while rendering React. See server logs for additional information.'
    )
  }

  if (result.error) {
    logger.error(result.error)
    throw new KeyworkResourceError(
      'A stream error occurred while rendering React. See server logs for additional information.'
    )
  }

  return result.stream
}
