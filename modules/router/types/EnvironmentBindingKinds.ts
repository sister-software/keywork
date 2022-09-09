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

import type { DurableObjectNamespace } from '../../__internal/interfaces/durable-objects.ts'
import type { KVNamespace } from '../../__internal/interfaces/kv.ts'
import type { WorkerServiceBinding } from '../interfaces/WorkerServiceBinding.ts'

/**
 * Either:
 *
 * - `WorkerServiceBinding` A `fetch` binding, usually an asset KV or external Worker.
 * - `KVNamespace` A KV binding.
 * - `DurableObjectNamespace` A Durable Object.
 */
export type EnvironmentBindingKinds = WorkerServiceBinding | KVNamespace | DurableObjectNamespace
