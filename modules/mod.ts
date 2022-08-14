/**
 * @module Keywork
 * @packageDocumentation
 *
 * Most Keywork modules can be imported at its primary entrypoint:
 *
 * ```ts
 * import {Router, Errors, Logger, ...} from 'keywork'
 * ```
 *
 * However, runtime specific modules must be imported directly from their entrypoint:
 *
 * ```ts
 * import { WorkerSitesAssetRouter } from 'keywork/router/cloudflare'
 * ```
 *
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

/* eslint-disable header/header */

/**
 * Namespace: Errors
 *
 * ```ts
 * import * as mod from 'keywork/errors'
 * ```
 */
export * as Errors from './errors/mod.ts'

/**
 * Namespace: Events
 *
 * ```ts
 * import * as mod from 'keywork/events'
 * ```
 */
export * as Events from './events/mod.ts'

/**
 * Namespace: Logger
 *
 * ```ts
 * import * as mod from 'keywork/logger'
 * ```
 */
export * as Logger from './logger/mod.ts'

/**
 * Namespace: Math
 *
 * ```ts
 * import * as mod from 'keywork/math'
 * ```
 */
export * as Math from './math/mod.ts'

/**
 * Namespace: Strings
 *
 * ```ts
 * import * as mod from 'keywork/strings'
 * ```
 */
export * as Strings from './strings/mod.ts'

/**
 * Namespace: Datetime
 *
 * ```ts
 * import * as mod from 'keywork/datetime'
 * ```
 */
export * as Datetime from './datetime/mod.ts'

/**
 * Namespace: Json
 *
 * ```ts
 * import * as mod from 'keywork/json'
 * ```
 */
export * as Json from './json/mod.ts'

/**
 * Namespace: Timers
 *
 * ```ts
 * import * as mod from 'keywork/timers'
 * ```
 */
export * as Timers from './timers/browser/mod.ts'

/**
 * Namespace: Files
 *
 * ```ts
 * import * as mod from 'keywork/files'
 * ```
 */
export * as Files from './files/mod.ts'

/**
 * Namespace: IDs
 *
 * ```ts
 * import * as mod from 'keywork/ids'
 * ```
 */
export * as IDs from './ids/mod.ts'

/**
 * Namespace: HTTP
 *
 * ```ts
 * import * as mod from 'keywork/http'
 * ```
 */
export * as HTTP from './http/mod.ts'

/**
 * Namespace: Router
 *
 * ```ts
 * import * as mod from 'keywork/router'
 * ```
 */
export * as Router from './router/mod.ts'

/**
 * Namespace: Session
 *
 * ```ts
 * import * as mod from 'keywork/session'
 * ```
 */
export * as Session from './session/mod.ts'

/**
 * Namespace: URL
 *
 * ```ts
 * import * as mod from 'keywork/uri'
 * ```
 */
export * as URL from './uri/mod.ts'
