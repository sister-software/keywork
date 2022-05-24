import { KeyworkResourceAccessError } from './errors.js'
import { prettyJSON } from './json.js'

/**
 * @internal
 */
interface ConsoleLike {
  debug(message?: any, ...optionalParams: any[]): void
  error(message?: any, ...optionalParams: any[]): void
  info(message?: any, ...optionalParams: any[]): void
  log(message?: any, ...optionalParams: any[]): void
  warn(message?: any, ...optionalParams: any[]): void
}

export const timestamp = (date = new Date()) => `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
timestamp.toString = () => timestamp()

const logTypes = new Map<keyof ConsoleLike, string>([
  ['log', '💬'],
  ['info', '💡'],
  ['warn', '⚠️'],
  ['debug', '🔎'],
])

export class PrefixedLogger {
  protected logPrefix: string
  public _log: ConsoleLike['log']
  protected _error: ConsoleLike['error']

  public log!: ConsoleLike['log']
  public info!: ConsoleLike['info']
  public warn!: ConsoleLike['warn']
  public debug!: ConsoleLike['debug']

  constructor(logPrefix: string, color = 'cyan') {
    let globalConsole: ConsoleLike

    // @ts-expect-error 2584
    if (typeof console !== 'undefined') {
      // @ts-expect-error 2584
      globalConsole = console as ConsoleLike
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
    const statusCode = error instanceof KeyworkResourceAccessError ? error.status : 500
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
