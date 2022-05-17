import { ErrorResponse, getBrowserIdentifier, HTMLResponse } from '@keywork/responder'
import { KeyworkResourceAccessError } from '@keywork/shared'
import React from 'react'
import { ReactDOMServerReadableStream, renderToReadableStream, RenderToReadableStreamOptions } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { KeyworkReactSSRRoutes, ProviderWrapper } from './components/KeyworkApp.js'
import { KeyworkHTMLDocument } from './components/KeyworkHTMLDocument.js'
import { HydrationProvider } from './ssr/HydrationProvider'
import { SSRPropsByPath, SSRPropsLike, SSRRouteRecords } from './ssr/props.mjs'
import { SSRProvider } from './ssr/SSRProvider.js'

interface ReactRenderStreamSuccessResult {
  stream: ReactDOMServerReadableStream
  error: null
}

interface ReactRenderStreamErrorResult {
  stream: ReactDOMServerReadableStream
  error: KeyworkResourceAccessError
}

type ReactRenderStreamResult = ReactRenderStreamSuccessResult | ReactRenderStreamErrorResult

async function renderReactStream(
  children: React.ReactNode,
  options?: RenderToReadableStreamOptions
): Promise<ReactRenderStreamResult> {
  const controller = new AbortController()
  let error: null | KeyworkResourceAccessError = null

  const stream = await renderToReadableStream(children, {
    ...options,
    signal: controller.signal,
    onError(_error) {
      error = KeyworkResourceAccessError.fromUnknownError(_error)
      console.error(error)
    },
  })

  return {
    stream,
    error,
  }
}

export async function createStaticPropsResponse<P extends SSRPropsLike>(
  request: Request,
  /**
   * A mapping of React Router route patterns to their React component handlers.
   * @TODO This is likely not needed in the near future.
   */
  routeRecords: SSRRouteRecords,
  pageProps?: P,
  /**
   * A component which wraps the current SSR routes.
   * Use this if you need to inject a provider into the SSR pipeline.
   */
  ProviderWrapper?: ProviderWrapper
): Promise<Response> {
  const location = new URL(request.url)

  const ssrPropsByPath: SSRPropsByPath<any> = new Map([[location.pathname, pageProps]])
  const browserIdentifier = getBrowserIdentifier(request)
  const appDocument = (
    <KeyworkHTMLDocument
      browserIdentifier={browserIdentifier}
      location={location}
      // isSocialPreview={location.searchParams.has(KeyworkQueryParamKeys.SharePreview)}
      appContent={
        <StaticRouter location={location}>
          <HydrationProvider initialLocation={location} origin={location.origin} ssrPropsByPath={ssrPropsByPath}>
            <KeyworkReactSSRRoutes routeRecords={routeRecords} ProviderWrapper={ProviderWrapper} />
          </HydrationProvider>

          <SSRProvider ssrPropsByPath={ssrPropsByPath} />
        </StaticRouter>
      }
    />
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
