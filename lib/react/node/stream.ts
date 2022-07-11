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

import { IReactStreamRenderer, ReactDOMServerReadableStream } from 'keywork/react/common'
import { renderToNodeStream } from 'react-dom/server'

export const renderReactStream: IReactStreamRenderer = (children) => {
  try {
    const stream = renderToNodeStream(children) as unknown as ReactDOMServerReadableStream
    stream.allReady = Promise.resolve()

    return Promise.resolve({
      stream,
      error: null,
      controller: null as unknown as AbortController,
    })
  } catch (error) {
    return Promise.resolve({
      stream: null as unknown as ReactDOMServerReadableStream,
      error,
      controller: null as unknown as AbortController,
    })
  }
}
