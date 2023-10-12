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

import { KeyworkResourceError } from 'keywork/errors'

const prettyJSON = (value: any) => JSON.stringify(value, null, 2)

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

export interface KeyworkLoggerConfig {
  readonly method: keyof GlobalConsoleLike | null
  readonly level: KeyworkLogLevel
  readonly prefix?: string
}

/**
 * Enum-like record of Keywork log levels.
 */
export const enum KeyworkLogLevel {
  None = 0,
  Trace = 1,
  Error = 2,
  Warning = 3,
  Log = 4,
  Info = 5,
  Debug = 6,
}
/**
 * The default level used by the Keywork logger.
 */
export const DEFAULT_LOG_LEVEL = KeyworkLogLevel.Info

/**
 * The default prefix used by the Keywork logger.
 */
export const DEFAULT_LOG_PREFIX = 'Keywork'

/**
 * Ordered collection of Keywork log levels to their corresponding configs.
 * @internal
 */
export const _KeyworkLogLevelConfigs = [
  {
    level: KeyworkLogLevel.None,
    method: null,
  },
  {
    level: KeyworkLogLevel.Trace,
    method: 'trace',
    prefix: '👀 ',
  },
  {
    level: KeyworkLogLevel.Log,
    method: 'log',
    prefix: '💬 ',
  },
  {
    level: KeyworkLogLevel.Info,
    method: 'info',
    prefix: '💡 ',
  },
  {
    level: KeyworkLogLevel.Error,
    method: 'error',
  },
  {
    level: KeyworkLogLevel.Warning,
    method: 'warn',
    prefix: '⚠️ ',
  },
  {
    level: KeyworkLogLevel.Debug,
    method: 'debug',
    prefix: '🔎 ',
  },
] as const satisfies readonly KeyworkLoggerConfig[]

/**
 * A map of log levels to their respective configuration.
 * @internal
 */
const _KeyworkLogLevelConfigMap = new Map<KeyworkLogLevel, KeyworkLoggerConfig>()
/**
 * A map of log levels to their respective indexes.
 *
 * Used to determine if a log level is enabled.
 * @internal
 */
const _KeyworkLogLevelIndexes = new Map<KeyworkLoggerConfig, number>()

for (const [index, config] of _KeyworkLogLevelConfigs.entries()) {
  _KeyworkLogLevelConfigMap.set(config.level, config)
  _KeyworkLogLevelIndexes.set(config, index)
}

/**
 * @internal
 */
const noop = () => void 0

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
export class KeyworkLogger {
  protected readonly logPrefix: string
  protected readonly globalConsole: GlobalConsoleLike
  protected readonly config: KeyworkLoggerConfig

  public trace!: GlobalConsoleLike['trace']
  public debug!: GlobalConsoleLike['debug']
  public log!: GlobalConsoleLike['log']
  public info!: GlobalConsoleLike['info']
  public warn!: GlobalConsoleLike['warn']

  constructor(logPrefix = 'Keywork', level?: KeyworkLogLevel, color = 'cyan') {
    if (typeof console !== 'undefined') {
      this.globalConsole = console as GlobalConsoleLike
    } else {
      throw new Error('Cannot create Prefixed Logger without a global console logger.')
    }

    this.logPrefix = `[${logPrefix}]`

    this.config =
      typeof level === 'undefined'
        ? _KeyworkLogLevelConfigMap.get(KeyworkLogLevel.Info)!
        : _KeyworkLogLevelConfigMap.get(level)!

    const levelIndex = _KeyworkLogLevelIndexes.get(this.config)!

    for (const [config, configLevel] of _KeyworkLogLevelIndexes) {
      if (!config.method) continue

      if (levelIndex <= configLevel) {
        this[config.method] = this._createLogMethod(config.method, config.prefix, color)
      } else {
        this[config.method] = noop
      }
    }
  }

  _createLogMethod(logType: keyof GlobalConsoleLike, logTypeLabel = '', color: string) {
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
