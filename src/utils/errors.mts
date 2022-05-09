export interface ErrorJSONBody {
  statusText: string
  statusCode: number
}

export class KeyworkResourceAccessError extends Error {
  constructor(public statusText: string, public status: number = 500) {
    super(statusText)
  }

  get message() {
    return this.statusText
  }

  toJSON(): ErrorJSONBody {
    return {
      statusText: this.statusText,
      statusCode: this.status,
    }
  }

  static fromUnknownError(_error: any): KeyworkResourceAccessError {
    const code = 500
    let message = 'An unknown Keywork error occured'

    if (_error instanceof Error || 'message' in _error) {
      message = _error.message
    }

    return new KeyworkResourceAccessError(message, code)
  }
}
