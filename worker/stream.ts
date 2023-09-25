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

///<reference types="../types/isomorphic-react-dom-server" />

import { KeyworkResourceError } from 'keywork/errors'
import { IReactStreamRenderer } from 'keywork/ssr'
import { renderToReadableStream } from 'react-dom/server.browser'

export const renderReactStream: IReactStreamRenderer = async (children, options) => {
  const controller = new AbortController()

  let error: null | KeyworkResourceError = null

  const stream = await renderToReadableStream(children as any, {
    ...options,
    signal: controller.signal,
    onError(_error: any) {
      error = new KeyworkResourceError(_error)
      console.error(error)
    },
  })

  return {
    stream,
    error,
    controller,
  }
}
