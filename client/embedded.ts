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

import { KeyworkResourceError } from 'keywork/errors'
import { IsomorphicFetchEventInit } from 'keywork/events'
import { KEYWORK_SSR_INIT_KEY, KEYWORK_SSR_PROPS_KEY, readGlobalScope } from 'keywork/utils'

/**
 * The global scope with embedded Keywork SSR props.
 * @internal
 */
export interface SSRClientScope<SSRProps extends {} | null = {}> {
  [KEYWORK_SSR_PROPS_KEY]: SSRProps
  [KEYWORK_SSR_INIT_KEY]: IsomorphicFetchEventInit
}

/**
 * Reads the SSR  from the global scope.
 * @param globalScope In most cases, this is either `window` or `self`.
 * @returns SSRProps
 * @internal
 */
export function readSSREmbed<SSRProps extends {} | null = {}>(globalScope: unknown = readGlobalScope()) {
  // First, we check if the SSR props have been embedded in the global scope...
  if (!globalScope || typeof globalScope !== 'object') {
    throw new KeyworkResourceError('Global scope does not appear to be an object.')
  }

  if (!(KEYWORK_SSR_PROPS_KEY in globalScope)) {
    throw new KeyworkResourceError(`\`${KEYWORK_SSR_PROPS_KEY}\` not in provided scope.`)
  }

  // Let's pluck them out...
  const staticProps = globalScope[KEYWORK_SSR_PROPS_KEY] as SSRProps

  if (typeof staticProps === 'undefined') {
    throw new KeyworkResourceError(
      'SSR Props is empty. To indicate there are no props, return null from `getStaticProps`'
    )
  }

  // Remove them from the global scope...
  // globalScope[KEYWORK_SSR_PROPS_KEY] = null as any

  // Likewise, we check if the SSR event init has been embedded in the global scope...
  if (!(KEYWORK_SSR_INIT_KEY in globalScope)) {
    throw new KeyworkResourceError(`\`${KEYWORK_SSR_INIT_KEY}\` not in provided scope.`)
  }

  // And pluck them out...
  const eventInit = globalScope[KEYWORK_SSR_INIT_KEY] as IsomorphicFetchEventInit

  // Likewise, we remove them from the global scope...
  // globalScope[KEYWORK_SSR_INIT_KEY] = null as any

  return {
    staticProps,
    eventInit,
  }
}
