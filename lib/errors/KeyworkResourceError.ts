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

import { Status } from 'https://deno.land/std@0.147.0/http/http_status.ts'
import { ErrorJSONBody } from './common.ts'

/**
 * An error class that feels fits nicely into an incoming HTTP request handler.
 * This pairs well with the `http-status` NPM package.
 *
 * @example
 * Check if a user has permission to do some action.
 *
 * ```typescript
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
  constructor(public statusText: string, public status: Status = Status.InternalServerError) {
    super(statusText)
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

  /**
   * Attempts to convert an unknown error object into a well-formed `KeyworkResourceError`
   */
  static fromUnknownError(
    /** Any kind of unknown error, usually from a try/catch block. */
    _error: any
  ): KeyworkResourceError {
    if (_error instanceof KeyworkResourceError) {
      return _error
    }

    const code = Status.InternalServerError
    let message = 'An unknown application error occured'

    if (_error instanceof Error || 'message' in _error) {
      message = _error.message
    }

    return new KeyworkResourceError(message, code)
  }
}