import { KeyworkCollection } from '@keywork/odm'
import { JSONResponse } from '@keywork/responder'

export default {
  /**
   * Your worker's incoming request handler.
   * Note that the `env` parameter will reflect your KV bindings in `wrangler.toml`
   *
   * @param request Request
   * @param env Env
   * @param ctx ExecutionContext
   *
   * @returns Response | Promise<Response>
   */
  fetch(request, env, _ctx) {
    const url = new URL(request.url)
    const usersCollection = new KeyworkCollection(env.users)

    if (url.pathname === '/') {
      const userDocumentsList = usersCollection.fetchDocumentsList()

      const body = {
        userCount: userDocumentsList.keys.length,
        keys: userDocumentsList.keys,
      }

      return new JSONResponse(body)
    }
  },
}
