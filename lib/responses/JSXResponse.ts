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

import { fileExtensionToContentTypeHeader } from 'keywork/headers'
import Stream from 'keywork/platform/stream'
import { ReactRendererOptions, renderToStream } from 'keywork/react/common'
import { renderReactStream } from 'keywork/react/worker'
import { CachableResponse } from './CachableResponse.ts'
import type * as React from 'react'

/**
 * A React JSX response that returns a full HTML document.
 *
 * @remarks
 * `JSXResponse` automatically handles several types of HTML response bodies.
 * For further details on each HTML body type, see the constructors below.
 * *
 * @typeParam StaticProps Optional static props returned by `GetStaticProps`
 *
 * @category HTTP Response
 * @public
 */
export class JSXResponse extends CachableResponse {
  constructor(
    /**
     * JSX elements containing only the current page's relevant content.
     * `JSXResponse` will automatically stream content to the browser.
     *
     * @see {GetStaticProps}
     */
    jsx: React.ReactElement,
    reactRenderOptions?: ReactRendererOptions,
    /** Headers to add to the response. */
    headersInit?: HeadersInit
  ) {
    // React's stream renderer is async, but constructors must be synchronous.
    // Let's get a stream ready for immediate use.
    const passThroughStream = new Stream.TransformStream()

    super(passThroughStream.readable, undefined, undefined, undefined, {
      ...fileExtensionToContentTypeHeader('html'),
      ...headersInit,
    })

    renderToStream(renderReactStream, passThroughStream, jsx, reactRenderOptions)
  }
}
