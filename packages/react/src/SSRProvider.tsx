// import React from 'react'
// import { renderToNodeStream } from 'react-dom/server'
// import { StaticRouter } from 'react-router-dom/server'
// import ReactApplication from '~components/pages/_app.js'
// import SSRDocument from '~components/pages/_document.js'
// import { RenderEnvProvider } from '~contexts/common/RenderEnvProvider.js'
// import { QueryParamKeys } from '~core/common/constants/site.js'
// import { fileExtensionToHeader } from '~core/common/net/responses.js'
// import { createNodeCompatibleTransformStream } from '~core/common/net/streams.js'
// import { HydrationProvider } from '~core/common/react/RouteDataFetcher.js'

export interface SSRProviderProps {
  ssrPropsByPath: SSRPropsByPath
}

export const SSRProvider: React.FC<SSRProviderProps> = ({ ssrPropsByPath }) => {
  return (
    <script
      id="__ssr_props-container"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `;(function() {
          const encoded = \`${encodeURIComponent(JSON.stringify(Object.fromEntries(ssrPropsByPath)))}\`;
          window.__ssr_props_by_path = JSON.parse(decodeURIComponent(encoded));
        }())`,
      }}
    />
  )
}

const streamTextEncoder = new TextEncoder()

export function respondWithStaticProps<P extends SSRPropsLike>(
  request: Request,
  pageProps?: P,
  moduleManifest?: string[]
): Response {
  return new Response()
}
//   const { readable, writer } = createNodeCompatibleTransformStream()

//   writer.write(streamTextEncoder.encode('<!DOCTYPE html>'))

//   const response = new Response(readable, {
//     status: 200,
//     headers: fileExtensionToHeader('.html'),
//   })

//   const location = new URL(request.url)

//   const ssrPropsByPath: SSRPropsByPath = new Map([[location.pathname, pageProps]])
//   let browserIdentifier = 'unknown'
//   const userAgent = (request.headers.get('user-agent') || '').toLowerCase()

//   if (userAgent.includes('chrome')) {
//     browserIdentifier = 'chrome'
//   } else if (userAgent.includes('safari')) {
//     browserIdentifier = 'safari'
//   }

//   const appDocument = (
//     <SSRDocument
//       browserIdentifier={browserIdentifier}
//       moduleManifest={moduleManifest}
//       location={location}
//       isSocialPreview={location.searchParams.has(QueryParamKeys.SharePreview)}
//       appContent={
//         <StaticRouter location={location}>
//           <HydrationProvider initialLocation={location} ssrPropsByPath={ssrPropsByPath}>
//             <RenderEnvProvider initialLocation={location}>
//               <ReactApplication />
//             </RenderEnvProvider>
//           </HydrationProvider>
//           <SSRProvider ssrPropsByPath={ssrPropsByPath} />
//         </StaticRouter>
//       }
//     />
//   )

//   const renderStream = renderToNodeStream(appDocument)

//   renderStream.pipe(writer)

//   return response
// }
