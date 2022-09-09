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

/**
 * An environment binding within a worker that has a `fetch` method.
 * This usually is related to Cloudflare Worker's [Service bindings](https://developers.cloudflare.com/workers/runtime-apis/service-bindings/),
 * such as static assets uploaded to Cloudflare KV via Wrangler's Worker Sites.
 */
export interface WorkerServiceBinding {
  fetch: typeof fetch
}
