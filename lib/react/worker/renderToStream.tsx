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

import { SSRPropsLike, StaticPropsProvider } from 'keywork/react/common'
import { PrefixedLogger } from 'keywork/utilities'
import React from 'react'
import { KeyworkHTMLDocumentComponent } from './KeyworkHTMLDocument.tsx'
import { KeyworkProvidersComponent } from './KeyworkProvidersComponent.tsx'
import { _SSRPropsEmbed } from './SSRPropsEmbed.tsx'
import { ReactRenderStreamResult, renderReactStream } from './stream/mod.ts'

/**
 * Renders the given React content to an HTML stream.
 * @ignore
 */
export async function renderToStream<StaticProps extends SSRPropsLike | null = null>(
  passThroughStream: TransformStream,
  /** The React component to render for this specific page. */
  pageElement: React.ReactElement<StaticProps>,
  /**
   * A HTML Document React component which wraps the entire application.
   * Use this if you need to replace the default HTML Document.
   */
  DocumentComponent: KeyworkHTMLDocumentComponent,
  /**
   * A React component which wraps the SSR routes.
   * Use this if you need to inject a provider into the SSR pipeline.
   */
  Providers: KeyworkProvidersComponent
): Promise<void> {
  const logger = new PrefixedLogger('React Stream Renderer')

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
    result = await renderReactStream(appDocument)
  } catch (error) {
    logger.error(error)
    return passThroughStream.readable.cancel(
      'An runtime error occurred while rendering React. See server logs for additional information.'
    )
  }

  if (result.error) {
    logger.error(result.error)
    return passThroughStream.readable.cancel(
      'A stream error occurred while rendering React. See server logs for additional information.'
    )
  }

  return result.stream.pipeTo(passThroughStream.writable)
}
