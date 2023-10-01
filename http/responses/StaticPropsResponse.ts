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

import type { CacheControlDirectives } from 'keywork/http/headers'
import { JSONResponse } from './JSONResponse.js'

/**
 * @ignore
 */
export interface PageElementProps<StaticProps extends {} | null = null> extends React.ReactElement<StaticProps> {
  children?: React.ReactNode
}

/**
 * A response that contains static props, used for client-side hydration.
 *
 * @internal
 * @ignore
 */
export class StaticPropsResponse extends JSONResponse {
  constructor(
    /**
     * The page element containing the static props.
     */
    pageElement: React.ReactElement<PageElementProps, string | React.JSXElementConstructor<any>>,
    /** A request to check for etag headers. */
    request?: Request,
    /** An etag for the given `json` parameter. */
    etag?: string,
    /** Options to generate a cache control header. */
    cacheControlOptions?: CacheControlDirectives,
    /** Headers to add to the response. */
    headersInit?: HeadersInit,
    /** Indenting of the JSON. Note that this may affect etag matching. */
    pretty = false
  ) {
    super(pageElement.props, request, etag, cacheControlOptions, headersInit, pretty)
  }
}
