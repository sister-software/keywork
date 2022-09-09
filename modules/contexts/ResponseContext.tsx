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

import { createContext, useContext } from 'https://esm.sh/react@18.2.0'
import { SetStateLike } from '../hooks/types.ts'

export interface ResponseRef {
  response: Response
}

export interface ResponseStateMethods {
  setHeaders: SetStateLike<Headers>
  setStatus: SetStateLike<number | undefined>
  setStatusText: SetStateLike<string | undefined>
  setBody: SetStateLike<BodyInit | null | undefined>
  setResponse: SetStateLike<Response>
}

export const ResponseContext = createContext<ResponseRef>({ response: new Response() })

export const useHeaders = () => {
  return useContext(ResponseContext).response.headers
}

export const useStatus = () => {
  return useContext(ResponseContext).response.status
}

export const useStatusText = () => {
  return useContext(ResponseContext).response.statusText
}

export const useBody = () => {
  return useContext(ResponseContext).response.body
}

export const useResponse = () => {
  return useContext(ResponseContext).response
}
