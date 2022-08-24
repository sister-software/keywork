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

import { Status } from '../../../errors/mod.ts'
import { ErrorResponse } from '../../../http/response/mod.ts'
import { KeyworkRouter } from '../../classes/KeyworkRouter.ts'
import type { KeyworkRouterOptions } from '../../interfaces/KeyworkRouterOptions.ts'
import type { RouteRequestHandler } from '../../interfaces/RouteRequestHandler.ts'
import type { WorkerEnvFetchBinding } from '../interfaces/WorkerEnvFetchBinding.ts'

/**
 * A router that proxies requests directly to an environment binding, such as a service binding.
 *
 * @typeParam BindingAlias The bound alias, usually defined in your wrangler.toml file.
 *
 * @category Router
 * @public
 */
export class ServiceBindingRouter<BindingAlias extends string> extends KeyworkRouter<
  Record<BindingAlias, WorkerEnvFetchBinding>
> {
  constructor(
    /**
     * The named alias of your binding. This is usually defined in your wrangler.toml file.
     */
    public bindingAlias: BindingAlias,
    options?: KeyworkRouterOptions
  ) {
    super({
      displayName: `Service Binding [${bindingAlias}]`,
      ...options,
    })

    this.all('*', this.onRequest)
  }

  private onRequest: RouteRequestHandler<Record<BindingAlias, WorkerEnvFetchBinding>> = ({ env, request }) => {
    if (!env || typeof env !== 'object') {
      const publicError = `\`env\` is not present`
      console.warn(publicError)

      return new ErrorResponse(
        Status.NotImplemented,
        `${publicError}. This may indicate an unsupported server environment.`
      )
    }

    /** The binding associated with the alias defined at router construction. */
    const proxiedBinding = env[this.bindingAlias]

    if (!proxiedBinding) {
      const publicError = `Binding \`${proxiedBinding}\` is not present in \`env\``

      this.logger.warn(publicError)
      /** All currently known binding aliases */
      const bindingAliases = Object.keys(env)

      this.logger.warn(
        `Your wrangler.toml may not be configured correctly. There are ${bindingAliases.length} binding(s) in env:`
      )
      bindingAliases.forEach((bindingAlias) => console.warn(bindingAlias))

      return new ErrorResponse(Status.NotImplemented, `${publicError}. See server logs for more info.`)
    }

    return proxiedBinding.fetch(request)
  }
}
