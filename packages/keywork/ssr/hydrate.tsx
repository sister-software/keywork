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

import { KeyworkHTMLDocumentAppRoot } from 'keywork/components'
import { LocationContext, StaticPropsContext } from 'keywork/contexts'
import { KeyworkResourceError } from 'keywork/errors'
import { Disposable } from 'keywork/lifecycle'
import { GlobalScopeWithKeyworkSSRProps, getSSRPropsFromScope, globalScopeHasSSRProps } from 'keywork/ssr'
import { Logger, readGlobalScope } from 'keywork/utils'
import { ReactNode } from 'react'
import { HydrationOptions, Root, hydrateRoot } from 'react-dom/client'

/**
 * @ignore
 */
export interface HydrateKeyworkAppOptions {
  rootID?: string
  globalScope?: GlobalScopeWithKeyworkSSRProps
  reactHydrationOptions?: HydrationOptions
}

/**
 * @ignore
 */
export type HydrationCallback<StaticProps extends {} | null = null> = (staticProps: StaticProps) => ReactNode

/**
 * A class representing a Keywork App's lifecycle.
 */
export class KeyworkApp implements Disposable {
  private logger = new Logger('KeyworkApp')
  private root?: Root

  /**
   * Hydrates a server-side rendered React component.
   *
   * This should only run in the browser.
   * @param initialChildren This should be the current page's component, along with any needed providers.
   */
  // Note that this is defined as an instance member to allow `promise.then` chaining.
  hydrate = <StaticProps extends {} | null = null>(
    initialChildren: HydrationCallback<StaticProps>,
    options?: HydrateKeyworkAppOptions
  ): void => {
    this.logger.debug('Hydrating...')

    const rootID = options?.rootID || KeyworkHTMLDocumentAppRoot
    const globalScope = options?.globalScope || readGlobalScope()

    if (!globalScopeHasSSRProps(globalScope) || !globalScope.document) {
      throw new KeyworkResourceError('Provided scope missing.')
    }

    const container = (globalScope.document as any).getElementById(rootID)
    if (!container) throw new Error(`Element with ID ${rootID} not found in DOM`)

    const location = new URL(globalScope.location.href)
    const staticProps = getSSRPropsFromScope<any>(globalScope)

    this.logger.debug(`Hydrating: ${location}`)

    const appElement: React.ReactNode = (
      <StaticPropsContext.Provider value={staticProps}>
        <LocationContext.Provider value={location}>{initialChildren(staticProps)}</LocationContext.Provider>
      </StaticPropsContext.Provider>
    )

    this.root = hydrateRoot(container, appElement as any, options?.reactHydrationOptions)

    this.logger.debug('Hydrated!')
  }

  dispose() {
    this.root?.unmount()
  }
}
