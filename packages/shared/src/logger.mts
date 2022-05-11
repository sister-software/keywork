import { KeyworkResourceAccessError } from './errors.mjs'
import { prettyJSON } from './json.mjs'

export const timestamp = (date = new Date()) => `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
timestamp.toString = () => timestamp()

const logTypes = new Map<keyof Console, string>([
  ['log', '💬'],
  ['info', '💡'],
  ['warn', '⚠️'],
  ['debug', '🔎'],
])
export class PrefixedLogger {
  protected logPrefix: string
  public _log: typeof console.log
  protected _error: typeof console.error

  public log!: typeof console.log
  public info!: typeof console.info
  public warn!: typeof console.warn
  public debug!: typeof console.debug
  constructor(logPrefix: string, color = 'cyan') {
    this.logPrefix = `[${logPrefix}]`

    this._log = console.log.bind(console)

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

      this[logType as 'log'] = console[logType as 'log'].bind(console, ...(bindArgs as [any]))
    }

    this._error = console.error.bind(console, this.logPrefix)
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
