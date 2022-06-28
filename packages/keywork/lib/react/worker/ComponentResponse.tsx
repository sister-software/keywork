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

import { StatusCodes } from 'http-status-codes'
import { fileExtensionToContentTypeHeader } from 'keywork/headers'
import { RouteProvider, SSRPropsLike, StaticPropsProvider } from 'keywork/react/common'
import { ErrorResponse, JSONResponse } from 'keywork/responses'
import { IncomingRequestEvent } from 'keywork/routing'
import { KeyworkQueryParamKeys, PrefixedLogger } from 'keywork/utilities'
import type { FC } from 'react'
import { KeyworkHTMLDocument, KeyworkHTMLDocumentComponent } from './KeyworkHTMLDocument.js'
import { KeyworkProviders, KeyworkProvidersComponent } from './KeyworkProvidersComponent.js'
import { _SSRPropsEmbed } from './SSRPropsEmbed.js'
import { ReactRenderStreamResult, renderReactStream } from './stream.js'

/**
 * A response that returns a full React component as HTML.
 *
 * @remarks
 * `ComponentResponse` will automatically stream content to the browser.
 *
 * @see {GetStaticProps}
 *
 * @typeParam StaticProps Optional static props returned by `GetStaticProps`
 *
 * @category HTTP Response
 * @public
 */
export class ComponentResponse<StaticProps extends SSRPropsLike | null = null> extends Response {
  static logger = new PrefixedLogger('Component Response')

  constructor(
    event: IncomingRequestEvent,
    /** The React component to render for this specific page. */
    PageComponent: FC<StaticProps>,
    /** The static props passed to `PageComponent`. */
    staticProps?: StaticProps,
    /**
     * A HTML Document React component which wraps the entire application.
     * Use this if you need to replace the default HTML Document.
     */
    DocumentComponent?: KeyworkHTMLDocumentComponent,
    /**
     * A React component which wraps the SSR routes.
     * Use this if you need to inject a provider into the SSR pipeline.
     */
    Providers?: KeyworkProvidersComponent
  ) {
    const location = new URL(event.request.url)
    const onlySendStaticProps = location.searchParams.has(KeyworkQueryParamKeys.StaticProps)

    if (!PageComponent) {
      const errorResponse = new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Response missing `PageComponent`')
      super(undefined, errorResponse)
      return
    }

    if (onlySendStaticProps && staticProps) {
      const json = new JSONResponse(staticProps)

      super(json.body, json)
      return
    }

    // React's stream renderer is async, but constructors must be synchronous.
    // Let's get a stream ready for immediate use.
    const passThroughStream = new TransformStream()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hasRendered = ComponentResponse.renderToStream<StaticProps>(
      passThroughStream,
      location,
      PageComponent,
      (staticProps || {}) as StaticProps,
      DocumentComponent,
      Providers
    )

    // event.waitUntil(hasRendered)

    super(passThroughStream.readable, {
      headers: fileExtensionToContentTypeHeader('html'),
    })
  }

  /**
   * @ignore
   */
  private static async renderToStream<StaticProps extends SSRPropsLike | null = null>(
    passThroughStream: TransformStream,
    location: URL,
    /** The React component to render for this specific page. */
    PageComponent: FC<StaticProps>,
    /** The static props passed to `PageComponent`. */
    staticProps: StaticProps,
    /**
     * A HTML Document React component which wraps the entire application.
     * Use this if you need to replace the default HTML Document.
     */
    DocumentComponent?: KeyworkHTMLDocumentComponent,
    /**
     * A React component which wraps the SSR routes.
     * Use this if you need to inject a provider into the SSR pipeline.
     */
    Providers?: KeyworkProvidersComponent
  ): Promise<void> {
    DocumentComponent = DocumentComponent || KeyworkHTMLDocument
    Providers = Providers || KeyworkProviders

    const appDocument = (
      <StaticPropsProvider staticProps={staticProps!}>
        <RouteProvider initialLocation={location}>
          <Providers>
            <DocumentComponent location={location}>
              <PageComponent {...(staticProps as any)} />

              <_SSRPropsEmbed staticProps={staticProps} />
            </DocumentComponent>
          </Providers>
        </RouteProvider>
      </StaticPropsProvider>
    )

    let result: ReactRenderStreamResult

    try {
      result = await renderReactStream(appDocument)
    } catch (error) {
      this.logger.error(error)
      return passThroughStream.readable.cancel(
        'An runtime error occurred while rendering React. See server logs for additional information.'
      )
    }

    if (result.error) {
      this.logger.error(result.error)
      return passThroughStream.readable.cancel(
        'A stream error occurred while rendering React. See server logs for additional information.'
      )
    }

    return result.stream.pipeTo(passThroughStream.writable)
  }
}
