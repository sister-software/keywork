import { matchPath } from 'react-router'
import { KeyworkSession } from '../KeyworkSession.js'
import { ErrorResponse } from '../responses/ErrorResponse.js'
import { HTTPMethod, RequestWithCFProperties, WorkerRouteHandler } from './common.js'

/**
 * Intercepts a given API worker, parses path params, and handles errors.
 */
export function createAPIWorkerHandler<Params extends {} | null = null, BoundAliases extends {} | null = null>(
  pattern: string,
  handler: WorkerRouteHandler<Partial<Params>, BoundAliases>,
  method: HTTPMethod = 'GET'
) {
  /**
   * The fetch handler that immediately receives an incoming requests
   * before passing the parsed data to a worker route handler.
   */
  const exportedHandler: ExportedHandler<BoundAliases> = {
    fetch: async (request, env, context) => {
      if (request.method !== method) return new ErrorResponse(405, 'Wrong Method')

      const location = new URL(request.url)
      const match = matchPath<string, string>(pattern, location.pathname)

      if (!match) return new ErrorResponse(400, 'Path does not match known patterns')

      const session = new KeyworkSession(request)

      try {
        return handler({
          request: request as RequestWithCFProperties,
          env: env as any,
          params: match.params as Partial<Params>,
          context,
          session,
        })
      } catch (_error) {
        return ErrorResponse.fromUnknownError(_error)
      }
    },
  }

  return exportedHandler
}
