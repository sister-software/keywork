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
import { StaticRouter } from 'react-router-dom/server'
// import { Helmet } from '../components/Helmet/Helmet.js'
import {
  KeyworkHTMLDocument,
  KeyworkHTMLDocumentComponent,
  KeyworkHTMLDocumentProps,
} from '../components/KeyworkHTMLDocument.js'
import { KeyworkProvidersComponent } from '../components/KeyworkSSRRoutes.js'
import { HydrationProvider } from './HydrationProvider.js'
import { GetStaticPropsHandler, SSRPropsByPath, SSRPropsLike } from './props.js'
import { ReactRenderStreamResult, renderReactStream } from './renderReactStream.js'
import { SSRProvider } from './SSRProvider.js'

async function renderStaticPropsAsJSON(request: Request, staticProps: NonNullable<SSRPropsLike>): Promise<Response> {
  const etag = await generateETag(convertJSONToETaggableString(staticProps))

  return new JSONResponse(staticProps, request, etag)
}

async function renderStaticPropsAsComponentStream<StaticProps extends NonNullable<SSRPropsLike>>(
  request: Request,
  staticProps: StaticProps,
  /** The React component to render for this specific page. */
  PageComponent: React.FC<StaticProps>,
  DocumentComponent: KeyworkHTMLDocumentComponent = KeyworkHTMLDocument,
  Providers?: KeyworkProvidersComponent
): Promise<Response> {
  const location = new URL(request.url)

  const ssrPropsByPath: SSRPropsByPath<any> = new Map([[location.pathname, staticProps]])
  const browserIdentifier = getBrowserIdentifier(request)

  // const helmetData = renderToString(<Helmet></Helmet>)

  const appDocument = (
    // <KeyworkHeadProvider helmetData={helmetData}>
    <DocumentComponent
      browserIdentifier={browserIdentifier}
      location={location}
      // isSocialPreview={location.searchParams.has(KeyworkQueryParamKeys.SharePreview)}
    >
      <StaticRouter location={location}>
        <HydrationProvider initialLocation={location} origin={location.origin} ssrPropsByPath={ssrPropsByPath}>
          {Providers ? (
            <Providers initialLocation={location}>
              <PageComponent {...staticProps} />
            </Providers>
          ) : (
            <PageComponent {...staticProps} />
          )}
        </HydrationProvider>

        <SSRProvider ssrPropsByPath={ssrPropsByPath} />
      </StaticRouter>
    </DocumentComponent>
    // </KeyworkHeadProvider>
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

  // TODO: remove when header ready
  await result.stream.allReady
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
  abstract DocumentComponent?: React.FC<KeyworkHTMLDocumentProps>

  abstract getStaticProps: GetStaticPropsHandler<StaticProps, BoundAliases>

  onRequestGet: IncomingRequestHandler<BoundAliases> = async (data) => {
    const { request } = data
    const location = new URL(request.url)
    const onlySendStaticProps = location.searchParams.has(KeyworkQueryParamKeys.StaticProps)

    let staticProps: StaticProps

    try {
      staticProps = await this.getStaticProps(data)
    } catch (error) {
      this.logger.error(error)
      return ErrorResponse.fromUnknownError(error)
    }

    if (onlySendStaticProps) {
      return renderStaticPropsAsJSON(request, staticProps || {})
    }

    return renderStaticPropsAsComponentStream(
      request,
      staticProps as NonNullable<typeof staticProps>,
      this.PageComponent as any,
      this.DocumentComponent,
      this.Providers
    )
  }
}
