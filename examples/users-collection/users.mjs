import { KeyworkCollection } from 'keyworkdb'

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

      return new Response(JSON.stringify(body, null, 2), {
        'Content-Type': 'text/json; charset=utf-8',
      })
    }
  },
}
