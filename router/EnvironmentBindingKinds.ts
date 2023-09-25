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

import type { DurableObjectNamespace } from 'keywork/__internal/interfaces/durable-objects'
import type { KVNamespace } from 'keywork/__internal/interfaces/kv'
import type { WorkerEnvFetchBinding } from 'keywork/router/WorkerEnvFetchBinding'

/**
 * Either:
 *
 * - `WorkerEnvFetchBinding` A `fetch` binding, usually an asset KV or external Worker.
 * - `KVNamespace` A KV binding.
 * - `DurableObjectNamespace` A Durable Object.
 */
export type EnvironmentBindingKinds = WorkerEnvFetchBinding | KVNamespace | DurableObjectNamespace
