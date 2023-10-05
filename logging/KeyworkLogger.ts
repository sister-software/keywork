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
  readonly level: KeyworkLogLevelValue
  readonly prefix?: string
}

/**
 * @internal
 */
export const _KEYWORK_LOG_LEVELS = ['None', 'Trace', 'Error', 'Warning', 'Log', 'Info', 'Debug'] as const

/**
 * Levels available to the Keywork logger.
 */
export type KeyworkLogLevelValue = (typeof _KEYWORK_LOG_LEVELS)[number]

/**
 * Enum-like record of Keywork log levels.
 */
export const KeyworkLogLevel = {
  None: 'None',
  Trace: 'Trace',
  Error: 'Error',
  Warning: 'Warning',
  Log: 'Log',
  Info: 'Info',
  Debug: 'Debug',
} as const satisfies Record<KeyworkLogLevelValue, KeyworkLogLevelValue>
/**
 * The default level used by the Keywork logger.
 */
export const DEFAULT_LOG_LEVEL = 'Info' satisfies KeyworkLogLevelValue

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
    level: 'None',
    method: null,
  },
  {
    level: 'Trace',
    method: 'trace',
    prefix: '👀 ',
  },
  {
    level: 'Log',
    method: 'log',
    prefix: '💬 ',
  },
  {
    level: 'Info',
    method: 'info',
    prefix: '💡 ',
  },
  {
    level: 'Error',
    method: 'error',
  },
  {
    level: 'Warning',
    method: 'warn',
    prefix: '⚠️ ',
  },
  {
    level: 'Debug',
    method: 'debug',
    prefix: '🔎 ',
  },
] as const satisfies readonly KeyworkLoggerConfig[]

/**
 * A map of log levels to their respective configuration.
 * @internal
 */
const _KeyworkLogLevelConfigMap = new Map<KeyworkLogLevelValue, KeyworkLoggerConfig>()
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

  constructor(logPrefix = 'Keywork', level: KeyworkLogLevelValue | number = KeyworkLogLevel.Info, color = 'cyan') {
    if (typeof console !== 'undefined') {
      this.globalConsole = console as GlobalConsoleLike
    } else {
      throw new Error('Cannot create Prefixed Logger without a global console logger.')
    }

    this.logPrefix = `[${logPrefix}]`

    if (typeof level === 'number') {
      this.config = _KeyworkLogLevelConfigs[level] || _KeyworkLogLevelConfigMap.get('Info')!
    } else {
      this.config = _KeyworkLogLevelConfigMap.get(level) || _KeyworkLogLevelConfigMap.get('Info')!
    }

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
