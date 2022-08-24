/**
 * Keywork is a modular and opinionated library,
 * providing structured guidence as your web app grows,
 * without locking you into a specific pattern.
 * ## Popular Modules
 *
 * @packageDocumentation
 * @module Keywork
 */

/* eslint-disable header/header */

/**
 * ```ts
 * import { DatetimeUtils } from 'keywork'
 * import * as mod from 'keywork/datetime'
 * ```
 *
 * {@link Keywork#DatetimeUtils **_Explore the Datetime Utilities Module_ ›**}
 */
export * as DatetimeUtils from './datetime/mod.ts'
/**
 *
 * ```ts
 * import { Errors } from 'keywork'
 * import * as Errors from 'keywork/errors'
 * ```
 *
 * {@link Keywork#Errors **_Explore the Errors Module_ ›**}
 */
export * as Errors from './errors/mod.ts'
/**
 * ```ts
 * import { Events } from 'keywork'
 * import * as Events from 'keywork/events'
 * ```
 *
 * {@link Keywork#Events **_Explore the Events Module_ ›**}
 */
export * as Events from './events/mod.ts'
/**
 * ```ts
 * import { FileUtils } from 'keywork'
 * import * as mod FileUtilsom 'keywork/files'
 * ```
 *
 * {@link Keywork#FileUtils **_Explore the File Utilities Module_ ›**}
 */
export * as FileUtils from './files/mod.ts'
/**
 * ```ts
 * import { HTTP } from 'keywork'
 * import * as HTTPod from 'keywork/http'
 * ```
 *
 * {@link Keywork#HTTP **_Explore the HTTP Module_ ›**}
 */
export * as HTTP from './http/mod.ts'
/**
 * ```ts
 * import { IDUtils } from 'keywork'
 * import * as IDUtilsfrom 'keywork/ids'
 * ```
 *
 * {@link Keywork#IDUtils **_Explore the ID Utilities Module_ ›**}
 */
export * as IDUtils from './ids/mod.ts'
/**
 * ```ts
 * import { JSONUtils } from 'keywork'
 * import * as mod from 'keywork/json'
 * ```
 *
 * {@link Keywork#JSONUtils **_Explore the JSON Utilities Module_ ›**}
 */
export * as JSONUtils from './json/mod.ts'
/**
 * ```ts
 * import { Logger } from 'keywork'
 * import * as mod from 'keywork/logger'
 * ```
 *
 * {@link Keywork#Logger **_Explore the Logger Module_ ›**}
 */
export * as Logger from './logger/mod.ts'
/**
 * ```ts
 * import { MathUtils } from 'keywork'
 * import * as mod from 'keywork/math'
 * ```
 *
 * {@link Keywork#MathUtils **_Explore the Math Utilities Module_ ›**}
 */
export * as MathUtils from './math/mod.ts'
/**
 * Designed with familiarity in mind, the server-side routing API
 * is inspired by Express.js, React Router, and the native Cloudflare Workers platform.
 *
 * {@link Keywork#Router **_Explore the Router Module_ ›**}
 *
 * ```ts title="worker.ts" runtime="cloudflare"
 * import { KeyworkRouter } from 'keywork/router'
 *
 * const app = new KeyworkRouter()
 *
 * app.get('/', () => 'Hello there! 👋')
 *
 * export default app
 * ```
 *
 * ```ts title="./your-project/server/mod.tsx" runtime="deno"
 * import { KeyworkRouter } from 'https://deno.land/x/keywork/modules/router/mod.ts'
 * import { serve } from 'https://deno.land/std@0.140.0/http/server.ts'
 *
 * const app = new KeyworkRouter()
 * serve((request) => app.fetch(request))
 * ```
 *
 * ```ts title="worker.ts" runtime="browser"
 * import { KeyworkRouter } from 'https://esm.sh/keywork/router'
 *
 * const app = new KeyworkRouter()
 *
 * app.get('/', () => 'Hello there! 👋')
 * ```
 */
export * as Router from './router/mod.ts'
/**
 * ```ts
 * import { Session } from 'keywork'
 * import * as Sessionfrom 'keywork/session'
 * ```
 *
 * {@link Keywork#Session **_Explore the Session Module_ ›**}
 */
export * as Session from './session/mod.ts'
/**
 * ```ts
 * import { StringUtils } from 'keywork'
 * import * as mod from 'keywork/strings'
 * ```
 *
 * {@link Keywork#StringUtils **_Explore the String Utilities Module_ ›**}
 */
export * as StringUtils from './strings/mod.ts'
/**
 * ```ts
 * import { TimerUtils } from 'keywork'
 * import * as mod from 'keywork/browser/timers'
 * ```
 *
 * {@link Keywork#TimerUtils#Browser **_Explore the Timer Utilities Module_ ›**}
 */
export * as TimerUtils from './timers/browser/mod.ts'
/**
 * ```ts
 * import { URIUtils } from 'keywork'
 * import * as mod URIUtilsrom 'keywork/uri'
 * ```
 *
 * {@link Keywork#URIUtils **_Explore the URI Module_ ›**}
 */
export * as URIUtils from './uri/mod.ts'
