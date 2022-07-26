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

import { ExtendableEvent } from '../common.ts'

/**
 * A Cloudflare-specific implementation of Service Worker Fetch Event
 *
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/ Cloudflare Documentation}
 */
export interface ExecutionContext extends ExtendableEvent {
  /**
   * Intercepts the request and allows the Worker to send a custom response.
   *
   * @deprecated The respondWith method is only applicable to the Service Worker format.
   *
   * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#respondwith Cloudflare Documentation}
   */
  respondWith(_response: globalThis.Response): void

  /**
   * Prevents a runtime error response when the Worker script throws an unhandled exception.
   *
   * @deprecated This generally not applicable to Cloudflare Pages or Worker Sites
   *
   * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#passthroughonexception Cloudflare Documentation}
   */
  passThroughOnException(): void
}

/**
 * @internal
 */
export function isCloudflareWorkerExecutionContext(eventLike: unknown): eventLike is ExecutionContext {
  return Boolean(eventLike && typeof eventLike === 'object' && 'waitUntil' in eventLike)
}

/** @ignore */
export interface IncomingRequestCfProperties {
  asn: number
  botManagement?: IncomingRequestCfPropertiesBotManagement
  city?: string
  clientTcpRtt: number
  clientTrustScore?: number
  colo: string
  continent?: string
  country: string
  httpProtocol: string
  latitude?: string
  longitude?: string
  metroCode?: string
  postalCode?: string
  region?: string
  regionCode?: string
  requestPriority: string
  timezone?: string
  tlsVersion: string
  tlsCipher: string
  tlsClientAuth: IncomingRequestCfPropertiesTLSClientAuth
}

/** @ignore */
export interface IncomingRequestCfPropertiesBotManagement {
  score: number
  staticResource: boolean
  verifiedBot: boolean
}

/** @ignore */
export interface IncomingRequestCfPropertiesTLSClientAuth {
  certIssuerDNLegacy: string
  certIssuerDN: string
  certPresented: '0' | '1'
  certSubjectDNLegacy: string
  certSubjectDN: string
  certNotBefore: string
  certNotAfter: string
  certSerial: string
  certFingerprintSHA1: string
  certVerified: string
}
