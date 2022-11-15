// /**
//  * @file This file is part of the Keywork project.
//  * @copyright Nirrius, LLC. All rights reserved.
//  * @author Teffen Ellis, et al.
//  * @license AGPL-3.0
//  *
//  * @remarks Keywork is free software for non-commercial purposes.
//  * You can be released from the requirements of the license by purchasing a commercial license.
//  * Buying such a license is mandatory as soon as you develop commercial activities
//  * involving the Keywork software without disclosing the source code of your own applications.
//  *
//  * @see LICENSE.md in the project root for further licensing information.
//  */

// import React, { useMemo } from 'https://esm.sh/react@18.2.0'
// // import { renderJSXToStream } from '../../react/mod.ts'
// import type { CacheControlDirectives } from '../headers/caching/mod.ts'
// import { fileExtensionToContentTypeHeader } from '../headers/content-type/mod.ts'
// // import type { ResponseConverter } from '../interfaces/mod.ts'
// // import { CachableResponse } from './CachableResponse.ts'

// export interface HTMLResponseProps {
//   cacheControl?: CacheControlDirectives
//   children: React.ReactNode
//   contentType?: string

// }

// /**
//  * A response that returns a full HTML document.
//  *
//  * `HTMLResponse` automatically handles several types of HTML response bodies.
//  *
//  * @see {JSXResponse}
//  * @category HTTP Response
//  * @public
//  */
// export const HTMLResponse: React.FC<HTMLResponseProps> = (props) =>
// }

// {
//   constructor(
//     /**
//      * A string containing a full HTML document, or a readable stream.
//      */
//     htmlLike: BodyInit,
//     /** An optional request to check for etag headers. */
//     request?: Request,
//     /** An optional etag for the given `json` parameter. */
//     etag?: string,
//     /** Options to generate a cache control header. */
//     cacheControlOptions?: CacheControlDirectives,
//     /** Headers to add to the response. */
//     headersInit?: HeadersInit
//   ) {
//     super(htmlLike, request, etag, cacheControlOptions, {
//       ...fileExtensionToContentTypeHeader('html'),
//       ...headersInit,
//     })
//   }

//   /** @internal */
//   static fromResponseLike: ResponseConverter<React.ReactElement> = async (reactElement, renderOptions) => {
//     const stream = await renderJSXToStream(reactElement, renderOptions)
//     return new HTMLResponse(stream)
//   }
// }
