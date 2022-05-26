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

import { IncomingRequestData } from '@keywork/responder'
import { KeyworkResourceError } from '@keywork/utils'

export type SSRPropsLike = {} | null

/**
 * The global key where SSR props are assigned.
 * @remarks This includes a space to prevent autocomplete from listing this key.
 */
export const globalScopeSSRKey = '__ keywork_ssr_props'
export type GlobalScopeSSRKey = typeof globalScopeSSRKey
export interface GlobalScopeWithKeyworkSSRProps<SSRProps extends SSRPropsLike = SSRPropsLike>
  extends Record<GlobalScopeSSRKey, SSRProps> {
  document?: unknown
  location: URL
}

/**
 * A request handler that fetches static props for a server-side rendered React component.
 */
export type GetStaticPropsHandler<
  /** The static props returned by the handler. */
  StaticProps extends {} | null,
  BoundAliases extends {} | null = null,
  AdditionalData extends {} | null = null
> = (
  /** Data parsed from the incoming request. */
  data: IncomingRequestData<BoundAliases>,
  /**
   * An optional argument for sending additional data to the handler.
   * This can be useful when a handler is invoked manually.
   */
  additionalData?: AdditionalData
) => StaticProps | Promise<StaticProps>

export function globalScopeHasSSRProps<SSRProps extends SSRPropsLike>(
  globalScope: unknown
): globalScope is GlobalScopeWithKeyworkSSRProps<SSRProps> {
  return Boolean(globalScope && globalScopeSSRKey in (globalScope as any))
}

/**
 *
 * @param globalScope In most cases, this is either `window` or `self`.
 * @returns SSRProps
 */
export function getSSRPropsFromScope<SSRProps extends SSRPropsLike>(globalScope: unknown): SSRProps {
  if (!globalScopeHasSSRProps<SSRProps>(globalScope)) {
    console.error(`Looking for ${globalScopeSSRKey} in scope:`, globalScope)
    throw new KeyworkResourceError('SSR props not in provided scope.')
  }

  const staticProps = globalScope[globalScopeSSRKey]

  if (typeof staticProps === 'undefined') {
    throw new KeyworkResourceError(
      'SSR Props is empty. To indicate there are no props, return null from `getStaticProps`'
    )
  }

  globalScope[globalScopeSSRKey] = null as any

  if (globalScope.document) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(globalScope.document as any)?.getElementById(globalScopeSSRKey)?.remove()
  }

  return staticProps
}
