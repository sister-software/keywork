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
import { Disposable, PrefixedLogger } from 'keywork/utilities'
import { ReactNode } from 'react'

import {
  GlobalScopeWithKeyworkSSRProps,
  KeyworkHTMLDocumentAppRoot,
  RouteProvider,
  SSRPropsLike,
  StaticPropsProvider,
} from 'keywork/react/common'
import { hydrateRoot, HydrationOptions, Root } from 'react-dom/client'
import { getSSRPropsFromScope, globalScopeHasSSRProps } from './staticProps.ts'

export interface HydrateKeyworkAppOptions {
  rootID?: string
  globalScope?: GlobalScopeWithKeyworkSSRProps
  reactHydrationOptions?: HydrationOptions
}

export type HydrationCallback<StaticProps extends SSRPropsLike | null = null> = (staticProps: StaticProps) => ReactNode

/**
 * A class representing a Keywork App's lifecycle.
 */
export class KeyworkApp implements Disposable {
  private logger = new PrefixedLogger('KeyworkApp')
  private root?: Root

  /**
   * Hydrates a server-side rendered React component.
   *
   * @remarks This should only run in the browser.
   * @param initialChildren This should be the current page's component, along with any needed providers.
   */
  // Note that this is defined as an instance member to allow `promise.then` chaining.
  hydrate = <StaticProps extends SSRPropsLike | null = null>(
    initialChildren: HydrationCallback<StaticProps>,
    options?: HydrateKeyworkAppOptions
  ): void => {
    this.logger.debug('Hydrating...')

    const rootID = options?.rootID || KeyworkHTMLDocumentAppRoot
    const globalScope = options?.globalScope || self

    if (!globalScopeHasSSRProps(globalScope) || !globalScope.document) {
      throw new KeyworkResourceError('Provided scope missing.')
    }

    const container = (globalScope.document as any).getElementById(rootID)
    if (!container) throw new Error(`Element with ID ${rootID} not found in DOM`)

    const location = new URL(globalScope.location.href)
    const staticProps = getSSRPropsFromScope<any>(globalScope)

    this.logger.debug(`Hydrating: ${location}`)

    const appElement = (
      <StaticPropsProvider staticProps={staticProps}>
        <RouteProvider initialLocation={location}>{initialChildren(staticProps)}</RouteProvider>
      </StaticPropsProvider>
    )

    this.root = hydrateRoot(container, appElement, options?.reactHydrationOptions)

    this.logger.debug('Hydrated!')
  }

  dispose() {
    this.root?.unmount()
  }
}
