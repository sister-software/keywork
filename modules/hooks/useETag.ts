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

import { useRequest } from '../contexts/RequestContext.tsx'
import { useResponseEffect } from '../contexts/ResponseContext.tsx'
import { Status, STATUS_TEXT } from '../errors/mod.ts'
import { isETagMatch } from '../http/headers/caching/mod.ts'

/**
 * A hook that sets the ETag header on the response.
 * If the request contains an If-None-Match header, and the ETag matches,
 * the response will be set to 304 Not Modified.
 *
 * You may want to disable caching in your browser development tools to avoid this behavior while debugging.
 *
 * @category Server Hook
 * @category Cache
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
 */
export function useETagEffect(
  /** An etag for the current response `body`. */
  etag: string | null | undefined
) {
  const request = useRequest()

  useResponseEffect((currentResponse) => {
    if (isETagMatch(request, etag)) {
      return new Response(undefined, {
        status: Status.NotModified,
        statusText: STATUS_TEXT[Status.NotModified],
        headers: { ETag: etag },
      })
    }

    return currentResponse
  })
}
