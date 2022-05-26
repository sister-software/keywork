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
 * @remarks This should only run in the browser.
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
