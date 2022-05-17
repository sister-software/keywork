import type { WorkersPagesAssetsBinding, WorkersSiteStaticContentBinding } from './assets.mjs'
import type { WorkerEnvFetchBinding } from './fetch.mjs'

export type EnvironmentBindingKinds = WorkerEnvFetchBinding | KVNamespace | DurableObjectNamespace

export interface EnvironmentBindingLike {
  [bindingName: string]: EnvironmentBindingKinds
}

export type CommonWorkerEnvironmentBindings<BoundAliases extends EnvironmentBindingLike = {}> = (
  | WorkersSiteStaticContentBinding
  | WorkersPagesAssetsBinding
) &
  BoundAliases
