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

import { KeyworkResourceError } from 'keywork/errors'
import { IsomorphicFetchEvent } from 'keywork/events'
import { fetchImportMap } from 'keywork/files'
import { PageElementComponent } from 'keywork/http'
import { KeyworkLogger } from 'keywork/logging'
import type { ReactDOMServerReadableStream } from 'react-dom/server'
import type { ReactRenderStreamResult, ReactRendererOptions } from './ReactRendererOptions.js'
import { RequestDocument } from './RequestDocument.js'
import { renderReactStream } from './stream.js'

/**
 * Renders the given React content to an HTML stream.
 * @ignore
 */
export async function renderJSXToStream(
  event: IsomorphicFetchEvent<any, any, any>,
  /** The React component to render for this specific page. */
  pageElement: PageElementComponent,
  reactRenderOptions?: ReactRendererOptions
): Promise<ReactDOMServerReadableStream> {
  const logger = reactRenderOptions?.logger || new KeyworkLogger('Keywork SSR')

  const streamRenderer = reactRenderOptions?.streamRenderer || renderReactStream
  const importMap = event.document.importMap || (await fetchImportMap())

  const appDocument = <RequestDocument event={event} pageElement={pageElement} importMap={importMap} />

  let result: ReactRenderStreamResult

  try {
    result = await streamRenderer(appDocument)
  } catch (error) {
    logger.error(error)
    throw new KeyworkResourceError(
      'A runtime error occurred while rendering React. See server logs for additional information.'
    )
  }

  if (result.error) {
    logger.error(result.error)
    throw new KeyworkResourceError(
      'A stream error occurred while rendering React. See server logs for additional information.'
    )
  }

  return result.stream
}
