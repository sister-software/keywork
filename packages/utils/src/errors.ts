import { StatusCodes } from 'http-status-codes'
export interface ErrorJSONBody {
  status: string
  statusCode: number
}

/**
 * An error class that feels fits nicely into an incoming HTTP request handler.
 * This pairs well with the `http-status-codes` NPM package.
 *
 * @remark Generally, uncaught instances of `KeyworkResourceError` will fail gracefully by any Worker using `KeyworkRequestHandler`.
 * This approach can free your Worker's incoming request handler from wrapping every failure operation with try/catch.
 * @see {KeyworkRequestHandler} for a more detailed example.
 *
 * @example <caption>Check if a user has permission to do some action.</caption>
 *          ```ts
 *          if (isLoggedIn(someUser))
 *            throw new KeyworkResourceError("You must be logged in to do that", StatusCodes.UNAUTHORIZED)
 *          }
 *          if (someUser.role !== 'admin')
 *            throw new KeyworkResourceError("Only an admin can access that", StatusCodes.FORBIDDEN)
 *          }
 * ```
 */
export class KeyworkResourceError extends Error {
  constructor(public statusText: string, public status: number = StatusCodes.INTERNAL_SERVER_ERROR) {
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

    const code = 500
    let message = 'An unknown application error occured'

    if (_error instanceof Error || 'message' in _error) {
      message = _error.message
    }

    return new KeyworkResourceError(message, code)
  }
}
