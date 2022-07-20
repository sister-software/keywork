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
 * ### `keywork/request/cloudflare`
 *
 * Request utilities exclusive to Cloudflare Workers
 *
 * @packageDocumentation
 * @module request.cloudflare
 */

/**
 * Extends the lifetime of the route handler even after a `Response` is sent to a client.
 */
export type WaitUntilCallback = (
  /**
   * The given promise argument will inform the Workers runtime to stay alive until the task completes.
   */
  nonBlockingTask: Promise<any>
) => void

export interface CloudflareWorkerEventContext {
  /**
   * Extends the lifetime of the route handler even after a `Response` is sent to a client.
   */
  readonly waitUntil: WaitUntilCallback
}

/** @internal */
export const eventContextStub: CloudflareWorkerEventContext = {
  waitUntil: () => Promise.resolve(),
}

/**
 * A function within the Worker that receives all incoming requests.
 *
 * @remarks
 * Generally, this interface is exclusive to {@link WorkerRouter#fetch}
 * and passed to your subclass' route handlers.
 *
 * This is nearly identical to `ExportedHandlerFetchHandler`
 * defined in the `@cloudflare/workers-types` package.
 * However, the `WorkerRequestHandler` type includes Keywork-specific helpers.
 *
 * :::note
 * This interface should not be used with Cloudflare Pages unless you've disabled function routing
 * with [advanced mode](https://developers.cloudflare.com/pages/platform/functions/#advanced-mode)
 * :::
 *
 * :::note
 * `WorkerRequestHandler` shouldn't be confused with [`PagesFunction`](https://github.com/cloudflare/workers-types/blob/master/manual-ts/pages.d.ts)
 *
 * Cloudflare **Pages** instead uses named exports e.g. `export const onRequest = ...`
 * :::
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 *
 * @see {ExportedHandlerFetchHandler} A near-identical type defined by Cloudflare.
 *
 * @category Request
 */
export type CloudflareWorkerRequestHandler<BoundAliases extends {} | null = null> = (
  request: globalThis.Request,
  env?: BoundAliases,
  /**
   * The Worker context object.
   *
   * @remarks
   * `passThroughOnException` is not available as it does not apply to Cloudflare Pages
   */
  context?: CloudflareWorkerEventContext
) => Promise<globalThis.Response> | globalThis.Response
