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

import { KeyworkResourceError } from '../../errors/mod.ts'
import { prettyJSON } from '../functions/prettyJSON.ts'

/**
 * An common shape of the `Console` interface.
 *
 * @category Logger
 * @ignore
 */
interface GlobalConsoleLike {
  trace(message?: any, ...optionalParams: any[]): void
  debug(message?: any, ...optionalParams: any[]): void
  error(message?: any, ...optionalParams: any[]): void
  info(message?: any, ...optionalParams: any[]): void
  log(message?: any, ...optionalParams: any[]): void
  warn(message?: any, ...optionalParams: any[]): void
}

/**
 * @internal Used to generate timestamps internally.
 */
const _timestamp = (date = new Date()) => `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
_timestamp.toString = () => _timestamp()

/**
 * @internal
 */
export enum LogLevel {
  Trace,
  Debug,
  Info,
  Warning,
  Error,
  Off,
}

/**
 * @internal
 */
const _logTypes = new Map<keyof GlobalConsoleLike, { icon: string; level: number }>([
  ['trace', { icon: '👀', level: LogLevel.Trace }],
  ['debug', { icon: '🔎', level: LogLevel.Debug }],
  ['log', { icon: '💬', level: LogLevel.Info }],
  ['info', { icon: '💡', level: LogLevel.Info }],
  ['warn', { icon: '⚠️', level: LogLevel.Warning }],
])

/**
 * @internal
 */
export const DEFAULT_LOG_LEVEL: LogLevel = LogLevel.Info
/**
 * A isomorphic logger available in both the browser and worker environments.
 *
 * ```ts
 * const logger = new Logger('Todo API')
 * logger.info('Fetching todo', todoID)
 * logger.error('Unexpected error')
 * ```
 *
 * @category Logger
 * @category Error
 * @public
 */
export class Logger {
  protected logPrefix: string
  protected level: LogLevel = DEFAULT_LOG_LEVEL
  protected globalConsole: GlobalConsoleLike

  public trace!: GlobalConsoleLike['trace']
  public debug!: GlobalConsoleLike['debug']
  public log!: GlobalConsoleLike['log']
  public info!: GlobalConsoleLike['info']
  public warn!: GlobalConsoleLike['warn']

  constructor(logPrefix: string, level: LogLevel = LogLevel.Warning, color = 'cyan') {
    if (typeof console !== 'undefined') {
      this.globalConsole = console as GlobalConsoleLike
    } else {
      throw new Error('Cannot create Prefixed Logger without a global console logger.')
    }

    this.level = level
    this.logPrefix = `[${logPrefix}]`

    // @ts-ignore Iteratable
    for (const [logType, { icon, level }] of _logTypes.entries()) {
      if (this.level <= level) {
        this[logType] = this._createLogMethod(logType, icon, color)
      }
    }
  }

  _createLogMethod(logType: keyof GlobalConsoleLike, logTypeLabel: string, color: string) {
    const bindArgs = [
      //
      `%c%s%c%s`,
      `color: white;`,
      logTypeLabel,
      `color: ${color};`,
      this.logPrefix,
    ]

    return this.globalConsole[logType as 'log'].bind(this.globalConsole, ...(bindArgs as [any]))
  }

  public error = (error: unknown) => {
    const message = error ? `${error as any}` : 'Unknown Error'
    const statusCode = error instanceof Error && KeyworkResourceError.assertIsInstanceOf(error) ? error.status : 500
    const stack = error instanceof Error ? error.stack : undefined

    this.globalConsole.error(this.logPrefix, statusCode, message, stack)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public json(json: {}) {
    for (const [key, value] of Object.entries(json)) {
      this.info(key, prettyJSON(value))
    }
  }
  public jsonEntries<T>(label: string, json: Iterable<T>, key: keyof T) {
    this.log(`${this.logPrefix} ${label}:`)
    // @ts-ignore Iteratable
    for (const entry of json) {
      this.globalConsole.log(prettyJSON(entry[key]))
    }
  }
}
