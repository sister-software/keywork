import { KeyworkResourceError, PrefixedLogger } from '@keywork/utils'
import React from 'react'
const logger = new PrefixedLogger('Hydrate')

import { hydrateRoot, HydrationOptions } from 'react-dom/client'
import { KeyworkRouter, StaticPropsProvider } from '../components/index.js'
import { getSSRPropsFromScope, globalScopeHasSSRProps, GlobalScopeWithKeyworkSSRProps } from './props.js'

const keyworkRootID = 'app-root'

export interface HydrateKeyworkAppOptions {
  rootID?: string
  globalScope?: GlobalScopeWithKeyworkSSRProps
  reactHydrationOptions?: HydrationOptions
}

/**
 * Hydrates a server-side rendered React component.
 *
 * @remark This should only run in the browser.
 * @param initialChildren This should be the current page's component, along with any needed providers.
 */
export function hydrateKeyworkApp(initialChildren: React.ReactNode, options?: HydrateKeyworkAppOptions) {
  const rootID = options?.rootID || keyworkRootID
  const globalScope = options?.globalScope || self

  if (!globalScopeHasSSRProps(globalScope) || !globalScope.document) {
    throw new KeyworkResourceError('Provided scope missing.')
  }

  const container = (globalScope.document as any).getElementById(rootID)
  if (!container) throw new Error(`Element with ID ${rootID} not found in DOM`)

  const location = new URL(globalScope.location.href)
  const staticProps = getSSRPropsFromScope<any>(globalScope)

  logger.debug(`Hydrating: ${location}`)
  const appElement = (
    <StaticPropsProvider staticProps={staticProps}>
      <KeyworkRouter initialLocation={location}>{initialChildren}</KeyworkRouter>
    </StaticPropsProvider>
  )

  return hydrateRoot(container, appElement, options?.reactHydrationOptions)
}
