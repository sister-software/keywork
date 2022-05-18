import type { WorkersPagesAssetsBinding, WorkersSiteStaticContentBinding } from './assets.mjs'
import type { WorkerEnvFetchBinding } from './fetch.mjs'

/**
 * Either:
 *
 * - `WorkerEnvFetchBinding` A `fetch` binding, usually an asset KV or external Worker.
 * - `KVNamespace` A KV binding.
 * - `DurableObjectNamespace` A Durable Object.
 */
export type EnvironmentBindingKinds = WorkerEnvFetchBinding | KVNamespace | DurableObjectNamespace

export type DefaultWorkerBindings = WorkersSiteStaticContentBinding | WorkersPagesAssetsBinding
