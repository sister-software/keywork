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

import { FetchEventProvider, IsomorphicFetchEvent } from 'keywork/events'
import { DEFAULT_LOG_LEVEL, DEFAULT_LOG_PREFIX, KeyworkLogLevel, KeyworkLogger } from 'keywork/logging'
import { URLContext } from 'keywork/uri'
import { SSRPropsByPath, SSRPropsProvider } from './SSRPropsProvider.js'
import { pluckNavigatorURL } from './dom.js'
import { readSSREmbed } from './embedded.js'

export interface KeyworkAppProps {
  logPrefix?: string
  logLevel?: KeyworkLogLevel
  children: React.ReactNode
}

/**
 * Hydrates a server-side rendered React component.
 *
 * This should only run in the browser.
 * @param initialChildren This should be the current page's component, along with any needed providers.
 */
export const KeyworkApp: React.FC<KeyworkAppProps> = ({
  logPrefix = DEFAULT_LOG_PREFIX,
  logLevel = DEFAULT_LOG_LEVEL,
  children,
}) => {
  const logger = new KeyworkLogger(logPrefix, logLevel)

  const { staticProps, eventInit } = readSSREmbed()
  const fetchEvent = new IsomorphicFetchEvent('fetch', eventInit)
  const initialNavigatorURL = pluckNavigatorURL()
  const initialPropsByPath: SSRPropsByPath = new Map([[initialNavigatorURL.pathname, staticProps]])

  return (
    <SSRPropsProvider initialLocation={initialNavigatorURL} initialPropsByPath={initialPropsByPath}>
      <FetchEventProvider event={fetchEvent} logger={logger}>
        <URLContext.Provider value={initialNavigatorURL}>{children}</URLContext.Provider>
      </FetchEventProvider>
    </SSRPropsProvider>
  )
}
