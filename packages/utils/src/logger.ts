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

import { KeyworkResourceError } from './errors.js'
import { prettyJSON } from './json.js'

export interface GlobalConsoleLike {
  debug(message?: any, ...optionalParams: any[]): void
  error(message?: any, ...optionalParams: any[]): void
  info(message?: any, ...optionalParams: any[]): void
  log(message?: any, ...optionalParams: any[]): void
  warn(message?: any, ...optionalParams: any[]): void
}

/**
 * @ignore
 */
const timestamp = (date = new Date()) => `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
timestamp.toString = () => timestamp()

const logTypes = new Map<keyof GlobalConsoleLike, string>([
  ['log', '💬'],
  ['info', '💡'],
  ['warn', '⚠️'],
  ['debug', '🔎'],
])

/**
 * A isomorphic logger available in the browser and worker environment.
 *
 * @example
 * ```ts
 * const logger = new PrefixedLogger('Todo API')
 * logger.info('Fetching todo', todoID)
 * logger.error('Unexpected error')
 * ```
 */
export class PrefixedLogger {
  protected logPrefix: string
  public _log: GlobalConsoleLike['log']
  protected _error: GlobalConsoleLike['error']

  public log!: GlobalConsoleLike['log']
  public info!: GlobalConsoleLike['info']
  public warn!: GlobalConsoleLike['warn']
  public debug!: GlobalConsoleLike['debug']

  constructor(logPrefix: string, color = 'cyan') {
    let globalConsole: GlobalConsoleLike

    // @ts-expect-error 2584
    if (typeof console !== 'undefined') {
      // @ts-expect-error 2584
      globalConsole = console as GlobalConsoleLike
    } else {
      throw new Error('Cannot create Prefixed Logger without a global console logger.')
    }

    this.logPrefix = `[${logPrefix}]`
    this._log = globalConsole.log.bind(globalConsole)

    // @ts-ignore Iteratable
    for (const [logType, logTypeLabel] of logTypes.entries()) {
      const bindArgs = [
        //
        `%c%s%c%s`,
        `color: white;`,
        logTypeLabel,
        `color: ${color};`,
        this.logPrefix,
      ]

      this[logType as 'log'] = globalConsole[logType as 'log'].bind(globalConsole, ...(bindArgs as [any]))
    }

    this._error = globalConsole.error.bind(globalConsole, this.logPrefix)
  }

  public error = (error: unknown) => {
    const message = error ? `${error as any}` : 'Unknown Error'
    const statusCode = error instanceof KeyworkResourceError ? error.status : 500
    const stack = error instanceof Error ? error.stack : undefined

    this._error(statusCode, message, stack)
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
      this._log(prettyJSON(entry[key]))
    }
  }
}
