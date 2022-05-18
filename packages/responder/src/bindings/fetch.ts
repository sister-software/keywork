/**
 * An environment binding within a worker that has a `fetch` method.
 * This usually is related to static assets uploaded to Cloudflare KV via Wrangler's Worker Sites.
 */
export type WorkerEnvFetchBinding = {
  fetch: typeof fetch
}
