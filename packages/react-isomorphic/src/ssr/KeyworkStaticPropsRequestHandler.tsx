/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import {
  convertJSONToETaggableString,
  ErrorResponse,
  generateETag,
  getBrowserIdentifier,
  HTMLResponse,
  IncomingRequestHandler,
  JSONResponse,
  KeyworkRequestHandler,
} from '@keywork/responder'
import { KeyworkQueryParamKeys } from '@keywork/utils'
import React from 'react'
import {
  KeyworkHTMLDocument,
  KeyworkHTMLDocumentComponent,
  KeyworkProviders,
  KeyworkProvidersComponent,
  KeyworkRouter,
  StaticPropsProvider,
} from '../components/index.js'
import { GetStaticPropsHandler, SSRPropsLike } from './props.js'
import { ReactRenderStreamResult, renderReactStream } from './renderReactStream.js'
import { SSRPropsEmbed } from './SSRPropsEmbed.js'

async function renderStaticPropsAsJSON(request: Request, staticProps: NonNullable<SSRPropsLike>): Promise<Response> {
  const etag = await generateETag(convertJSONToETaggableString(staticProps))

  return new JSONResponse(staticProps, request, etag)
}

async function renderStaticPropsAsComponentStream<StaticProps extends NonNullable<SSRPropsLike>>(
  request: Request,
  staticProps: StaticProps,
  /** The React component to render for this specific page. */
  PageComponent: React.FC<StaticProps>,
  DocumentComponent?: KeyworkHTMLDocumentComponent,
  Providers?: KeyworkProvidersComponent
): Promise<Response> {
  const location = new URL(request.url)

  const browserIdentifier = getBrowserIdentifier(request)
  DocumentComponent = DocumentComponent || KeyworkHTMLDocument
  Providers = Providers || KeyworkProviders

  const appDocument = (
    <StaticPropsProvider staticProps={staticProps}>
      <KeyworkRouter initialLocation={location}>
        <Providers>
          <DocumentComponent browserIdentifier={browserIdentifier} location={location}>
            <PageComponent {...staticProps} />

            <SSRPropsEmbed staticProps={staticProps} />
          </DocumentComponent>
        </Providers>
      </KeyworkRouter>
    </StaticPropsProvider>
  )

  let result: ReactRenderStreamResult

  try {
    result = await renderReactStream(appDocument)
  } catch (error) {
    console.error(error)

    // TODO: render some fallback HTML.
    return ErrorResponse.fromUnknownError(error, 'An error occured during rendering...')
  }

  if (result.error) {
    // TODO: render some fallback HTML.
    return ErrorResponse.fromUnknownError(result.error, 'An error occured during rendering...')
  }

  return new HTMLResponse(result.stream)
}

// if (!onlySendStaticProps && process.env.NODE_ENV !== 'development') {
//   const ga = new GA(request, session.sessionID)
//   context.waitUntil(ga.send(HitType.PAGE_VIEW))
// }

export abstract class KeyworkStaticPropsRequestHandler<
  StaticProps extends SSRPropsLike,
  BoundAliases extends {} | null = null
> extends KeyworkRequestHandler<BoundAliases> {
  /** The React component to render for this specific page. */
  abstract PageComponent: React.FC<StaticProps>

  /**
   * A React component which wraps the SSR routes.
   * Use this if you need to inject a provider into the SSR pipeline.
   */
  abstract Providers?: KeyworkProvidersComponent
  /**
   * A HTML Document React component which wraps the entire application.
   * Use this if you need to replace the default HTML Document.
   */
  abstract DocumentComponent?: KeyworkHTMLDocumentComponent

  abstract getStaticProps: GetStaticPropsHandler<StaticProps, BoundAliases>

  onRequestGet: IncomingRequestHandler<BoundAliases> = async (data) => {
    const { request } = data
    const location = new URL(request.url)
    const onlySendStaticProps = location.searchParams.has(KeyworkQueryParamKeys.StaticProps)

    let staticProps: NonNullable<StaticProps>

    try {
      staticProps = ((await this.getStaticProps(data)) || {}) as NonNullable<StaticProps>
    } catch (error) {
      this.logger.error(error)
      return ErrorResponse.fromUnknownError(error)
    }

    if (onlySendStaticProps) {
      return renderStaticPropsAsJSON(request, staticProps || {})
    }

    return renderStaticPropsAsComponentStream(
      request,
      staticProps,
      this.PageComponent as any,
      this.DocumentComponent as any,
      this.Providers as any
    )
  }
}
