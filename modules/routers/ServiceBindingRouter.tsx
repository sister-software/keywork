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

import React from 'https://esm.sh/react@18.2.0'
import { useEnvironment, useRequest, useServerEffect } from '../contexts/mod.ts'
import { cloneAsMutableResponse } from '../http/mod.ts'
import { WorkerServiceBinding } from '../router/mod.ts'

interface ServiceBindingRouterProps {
  /**
   * The named alias of your binding. This is usually defined in your wrangler.toml file.
   */
  alias: string
}

/**
 * A router that proxies requests directly to a Cloudflare Worker environment binding,
 * such as a service binding.
 *
 * Cloudflare's concept of "environment bindings" _almost_ satisfy the `Fetcher` interface,
 * and with the help of the `ServiceBindingRouter` class, they can be used as middleware within Keywork!
 *
 * ### Combining Multiple Workers
 *
 * The `ServiceBindingRouter` class proxies requests directly to an environment binding,
 * such as a service binding configured in your project's `wrangler.toml`,
 * allowing you to compose your app from multiple Workers, regardless if they use Keywork or not.
 *
 * @typeParam BindingAlias The bound alias, usually defined in your wrangler.toml file.
 *
 * @category Cloudflare Middleware
 * @public
 */
export const ServiceBindingRouter: React.FC<ServiceBindingRouterProps> = ({ alias }) => {
  /** The binding associated with the alias defined at router construction. */
  const proxiedBinding = useEnvironment<Record<string, WorkerServiceBinding>>(alias)
  const request = useRequest()

  useServerEffect(
    async ({ setResponse }) => {
      const response = await proxiedBinding.fetch(request)
      setResponse(cloneAsMutableResponse(response))
    },
    [proxiedBinding, request]
  )

  return null
}
