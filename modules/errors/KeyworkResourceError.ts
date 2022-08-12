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

import { Status, STATUS_TEXT } from 'https://deno.land/std@0.149.0/http/http_status.ts'
import { ErrorJSONBody } from './common.ts'
export { Status, STATUS_TEXT }

/**
 * Used in place of the reference-sensitive `instanceof`
 * @see {KeyworkResourceError.assertIsInstanceOf}
 * @see {KeyworkResourceError.assertIsConstructorOf}
 * @ignore
 */
export const $ClassID = 'Keywork.KeyworkResourceError'

/**
 * An error class that feels fits nicely into an incoming HTTP request handler.
 *
 * @example
 *
 * ```ts
 * import { KeyworkResourceError, StatusCodes } from 'keywork/errors'
 *
 * if (isLoggedIn(someUser))
 *   throw new KeyworkResourceError("You must be logged in to do that", StatusCodes.UNAUTHORIZED)
 * }
 * if (someUser.role !== 'admin')
 *   throw new KeyworkResourceError("Only an admin can access that", StatusCodes.FORBIDDEN)
 * }
 * ```
 * @public
 * @category Error
 */
export class KeyworkResourceError extends Error {
  /**
   * The reason for the error.
   */
  public statusText: string
  /**
   * The HTTP Status Code associated with the error.
   */
  public status: Status

  /**
   * Parameters in the format of an HTTP status error.
   */
  constructor(
    /**
     * The reason for the error.
     * @defaultValue STATUS_TEXT[Status.InternalServerError]
     * @see {STATUS_TEXT} Re-exported from `https://deno.land/std@0.149.0/http/http_status.ts`
     */
    statusText?: string,
    /**
     * The HTTP Status Code associated with the error.
     * @defaultValue Status.InternalServerError
     * @see {Status} Re-exported from `https://deno.land/std@0.149.0/http/http_status.ts`
     */
    status?: Status
  )
  /**
   * @deprecated TypeScript has inferred that `errorLike` is already an instance of `KeyworkResourceError`
   */
  constructor(errorLike: KeyworkResourceError)
  /**
   * Converting an unknown error object into a well-formed `KeyworkResourceError`
   */
  constructor(
    /** Any kind of unknown error, usually from a try/catch block. */
    errorLike: unknown,
    /**
     * The HTTP Status Code associated with the error.
     * @defaultValue Status.InternalServerError
     * @see {Status} Re-exported from `https://deno.land/std@0.149.0/http/http_status.ts`
     */
    status?: Status
  )
  constructor(...args: any[]) {
    let statusText = STATUS_TEXT[Status.InternalServerError]
    let status = Status.InternalServerError

    if (KeyworkResourceError.assertIsInstanceOf(args[0])) {
      statusText = args[0].statusText
      status = args[0].status
    } else if (args[0] instanceof Error) {
      if ('message' in args[0] && args[0].message) {
        statusText = args[0].message
      }
    } else {
      statusText = args[0] || STATUS_TEXT[Status.InternalServerError]
      status = args[1] || Status.InternalServerError
    }

    super(statusText)
    this.statusText = statusText
    this.status = status
  }

  get message() {
    return this.statusText
  }

  toJSON(): ErrorJSONBody {
    return {
      status: this.statusText,
      statusCode: this.status,
    }
  }

  //#region Internal

  /** @ignore */
  readonly [$ClassID] = true as boolean
  /** @ignore */
  static readonly [$ClassID] = true as boolean

  static assertIsInstanceOf(errorLike: Error): errorLike is KeyworkResourceError {
    return Boolean(
      errorLike instanceof KeyworkResourceError || (typeof errorLike === 'object' && $ClassID in errorLike)
    )
  }

  static assertIsConstructorOf(ErrorCtor: unknown): ErrorCtor is typeof KeyworkResourceError {
    return Boolean(
      typeof ErrorCtor === 'function' &&
        (Object.getPrototypeOf(ErrorCtor) === KeyworkResourceError || $ClassID in ErrorCtor)
    )
  }
}
