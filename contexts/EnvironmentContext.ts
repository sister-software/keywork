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

import { KeyworkResourceError, Status } from 'keywork/errors'
import { createContext, useContext } from 'react'

/**
 * Context for consuming the environment bindings associated with the current request.
 */
export const EnvironmentContext = createContext<{}>({})

EnvironmentContext.displayName = 'EnvironmentContext'

/**
 * Hook for consuming the environment bindings associated with the current request.
 *
 * The value of this context is derived from your application's runtime:
 *
 * - Cloudflare Workers: `env` object passed from the current request.
 * - Deno: `Deno.env.toObject()`.
 * - Node.js: `process.env`.
 */
export function useEnvironment<BoundEnvironmentAliases = {}>(bindingAlias: keyof BoundEnvironmentAliases) {
  const envContext = useContext(EnvironmentContext) as BoundEnvironmentAliases

  if (!envContext || typeof envContext !== 'object') {
    const publicError = `\`env\` is not present`
    console.warn(publicError)

    throw new KeyworkResourceError(
      `${publicError}. This may indicate an unsupported server environment.`,
      Status.NotImplemented
    )
  }

  const binding = envContext[bindingAlias]

  if (!binding) {
    const publicError = `Binding \`${binding}\` is not present in \`env\``

    console.warn(publicError)
    /** All currently known binding aliases */
    const bindingAliases = Object.keys(envContext)

    console.warn(
      `Your wrangler.toml may not be configured correctly. There are ${bindingAliases.length} binding(s) in env:`
    )
    bindingAliases.forEach((bindingAlias) => console.warn(bindingAlias))

    throw new KeyworkResourceError(`${publicError}. See server logs for more info.`, Status.NotImplemented)
  }

  return binding
}
