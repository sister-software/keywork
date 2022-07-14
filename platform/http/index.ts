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

import { polyfillWithModule } from 'keywork/polyfills/platform'

interface HTTPModuleExports {
  Request: typeof globalThis.Request
  Headers: typeof globalThis.Headers
  Response: typeof globalThis.Response
}

const moduleExports = await polyfillWithModule<HTTPModuleExports>('undici', ['Request', 'Headers', 'Response'])

export class Request extends moduleExports.Request {}
export class Headers extends moduleExports.Headers {}
export class Response extends moduleExports.Response {}
