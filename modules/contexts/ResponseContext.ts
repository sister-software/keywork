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

/**
 * An immutable Response wrapper.
 * @internal
 */
export class ResponseRef implements Response {
  protected _response: Response

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this._response = new Response(body, init)
  }

  /**
   * Unboxes the given response.
   */
  public unbox() {
    return this._response
  }

  public get headers() {
    const clonedHeaders = new Headers()

    for (const [key, value] of this._response.headers) {
      clonedHeaders.set(key, value)
    }

    return clonedHeaders
  }

  /**
   * Replaces the response headers with the given value.
   */
  setHeaders: SetStateLike<Headers> = (value) => {
    const { body, status, statusText, headers } = this._response

    this._response = new Response(body, {
      headers: typeof value === 'function' ? value(headers) : value,
      status,
      statusText,
    })
  }

  public get status() {
    return this._response.status
  }

  /**
   * Replaces the response status with the given value.
   */
  setStatus: SetStateLike<number | undefined> = (value) => {
    const { body, status, statusText, headers } = this._response

    this._response = new Response(body, {
      headers,
      status: typeof value === 'function' ? value(status) : value,
      statusText,
    })
  }

  public get statusText() {
    return this._response.statusText
  }

  /**
   * Replaces the response status text with the given value.
   */
  setStatusText: SetStateLike<string | undefined> = (value) => {
    const { body, status, statusText, headers } = this._response

    this._response = new Response(body, {
      headers,
      status,
      statusText: typeof value === 'function' ? value(statusText) : value,
    })
  }

  public get body() {
    return this._response.body
  }

  /**
   * Replaces the response body with the given value.
   */
  setBody: SetStateLike<BodyInit | null | undefined> = async (value) => {
    this._response = new Response(typeof value === 'function' ? value(this._response.body) : value, this._response)
  }

  /**
   * Replaces the entire response with the given value.
   */
  setResponse: SetStateLike<Response> = (value) => {
    this._response = typeof value === 'function' ? value(this._response) : value
  }

  public clone() {
    return this._response.clone()
  }

  get ok() {
    return this._response.ok
  }

  get redirected() {
    return this._response.redirected
  }

  get type() {
    return this._response.type
  }

  get url() {
    return this._response.url
  }

  get bodyUsed() {
    return this._response.bodyUsed
  }

  public arrayBuffer(): Promise<ArrayBuffer> {
    return this._response.arrayBuffer()
  }

  public blob(): Promise<Blob> {
    return this._response.blob()
  }

  public formData(): Promise<FormData> {
    return this._response.formData()
  }

  public json(): Promise<any> {
    return this._response.json()
  }

  public text(): Promise<string> {
    return this._response.text()
  }
}

/**
 * A React context that defines the current response effect queue.
 * @internal
 */
export const ResponseEffectQueueContext = createContext<ResponseRef>(new ResponseRef())
ResponseEffectQueueContext.displayName = 'ResponseEffectQueueContext'

/**
 * A React hook that returns the current response **read-only** headers.
 */
export const useHeaders = (): Headers => {
  return useContext(ResponseEffectQueueContext).headers
}

/**
 * A React hook that returns the current response **read-only** status.
 */
export const useStatus = (): number => {
  return useContext(ResponseEffectQueueContext).status
}

/**
 * A React hook that returns the current response **read-only** status text.
 */
export const useStatusText = (): string => {
  return useContext(ResponseEffectQueueContext).statusText
}

/**
 * A React hook that returns the current response **read-only** body.
 */
export const useBody = (): ReadableStream<Uint8Array> | null => {
  return useContext(ResponseEffectQueueContext).body
}

/**
 * A React hook that returns the current response.
 */
export const useResponse = () => {
  return useContext(ResponseEffectQueueContext)
}
