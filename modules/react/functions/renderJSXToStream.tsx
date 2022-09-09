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

import { ReactDOMServerReadableStream } from 'https://esm.sh/react-dom@18.2.0/server.browser'
import React, { ReactElement } from 'https://esm.sh/react@18.2.0'
import { KeyworkResourceError } from '../../errors/mod.ts'
import { Logger } from '../../logger/mod.ts'
import { KeyworkHTMLDocument } from '../components/KeyworkHTMLDocument.tsx'
import { KeyworkProviders } from '../components/KeyworkProvidersComponent.tsx'
import { _SSRPropsEmbed } from '../components/SSRPropsEmbed.tsx'
import { StaticPropsProvider } from '../components/StaticPropsProvider.tsx'
import { KeyworkRenderOptions, ReactRenderStreamResult } from '../interfaces/KeyworkRenderOptions.ts'
import { renderReactStream } from '../worker/stream.ts'

/**
 * Renders the given React content to an HTML stream.
 * @ignore
 */
export async function renderJSXToStream<StaticProps extends {} | null = null>(
  /** The React component to render for this specific page. */
  pageElement: ReactElement<StaticProps>,
  reactRenderOptions?: KeyworkRenderOptions
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
