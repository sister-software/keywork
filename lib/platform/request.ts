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

// import * as undici from 'undici'
import type { IncomingRequestCfProperties } from './cloudflare.ts'

export interface $RequestInit extends globalThis.RequestInit {}
export type $RequestInfo = globalThis.RequestInfo

export class $Request extends globalThis.Request {
  /**
   * Extra information about the request provided by Cloudflare's edge.
   */
  cf?: IncomingRequestCfProperties
}

// export interface $Request extends Request {
//   new (input: URL | RequestInfo, init?: $RequestInit): undici.Request
// }
// export class $Request extends (typeof globalThis.Request !== 'undefined'
//   ? (globalThis.Request as unknown as typeof undici.Request)
//   : undici.Request) {
// }
