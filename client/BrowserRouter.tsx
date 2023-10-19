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

import { createContext, useContext, useMemo } from 'react'
import { FetchEventProvider, IsomorphicFetchEvent } from '../events/index.js'
import { DEFAULT_LOG_LEVEL, DEFAULT_LOG_PREFIX, KeyworkLogLevel, KeyworkLogger } from '../logging/index.js'
import { RoutePatternsProps, URLContext } from '../uri/index.js'
import { KeyworkPatternToPageComponent } from './KeyworkPatternToPageComponent.js'
import { SSRPropsByPath, SSRPropsProvider } from './SSRPropsProvider.js'
import { pluckNavigatorURL } from './dom.js'
import { readSSREmbed } from './embedded.js'

export interface BrowserRouterContextValue {
  push: (path: string, state: any) => void
  replace: (path: string, state: any) => void
  go: (delta: number) => void
  goBack: () => void
  goForward: () => void
}

const BrowserRouterContext = createContext<BrowserRouterContextValue>(undefined as any)
BrowserRouterContext.displayName = 'BrowserRouterContext'

export const useBrowserRouter = () => {
  return useContext(BrowserRouterContext)
}

export interface BrowserRouterProps extends RoutePatternsProps {
  logPrefix?: string
  logLevel?: KeyworkLogLevel
  history?: History
}

/**
 * Hydrates a server-side rendered React component.
 *
 * This should only run in the browser.
 * @param initialChildren This should be the current page's component, along with any needed providers.
 */
export const BrowserRouter: React.FC<BrowserRouterProps> = ({
  logPrefix = DEFAULT_LOG_PREFIX,
  logLevel = DEFAULT_LOG_LEVEL,
  routes,
  history: currentHistory = window.history,
}) => {
  const logger = new KeyworkLogger(logPrefix, logLevel)

  const { staticProps, eventInit } = readSSREmbed()
  const fetchEvent = new IsomorphicFetchEvent('fetch', eventInit)
  const initialNavigatorURL = pluckNavigatorURL()
  const initialPropsByPath: SSRPropsByPath = new Map([[initialNavigatorURL.pathname, staticProps]])

  const value = useMemo<BrowserRouterContextValue>(() => {
    return {
      push: (path: string, state?: any) => {
        currentHistory.pushState(state, '', path)
      },
      replace: (path: string, state?: any) => {
        currentHistory.replaceState(state, '', path)
      },
      go: (delta: number) => {
        currentHistory.go(delta)
      },
      goBack: () => {
        currentHistory.back()
      },
      goForward: () => {
        currentHistory.forward()
      },
    }
  }, [currentHistory])

  return (
    <FetchEventProvider event={fetchEvent} logger={logger}>
      <SSRPropsProvider
        currentLocation={window.location}
        initialLocation={initialNavigatorURL}
        initialPropsByPath={initialPropsByPath}
      >
        <URLContext.Provider value={initialNavigatorURL}>
          <BrowserRouterContext.Provider value={value}>
            <KeyworkPatternToPageComponent routes={routes} />
          </BrowserRouterContext.Provider>
        </URLContext.Provider>
      </SSRPropsProvider>
    </FetchEventProvider>
  )
}
