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

import { IsomorphicFetchEvent } from 'keywork/events'
import { RequestContext } from 'keywork/http'
import { KeyworkLogger, KeyworkLoggerContext } from 'keywork/logging'
import { URLPatternResultContext } from 'keywork/uri'
import { EnvironmentContext } from './EnvironmentContext.js'

export interface FetchEventProviderProps<BoundAliases = {}, ExpectedParams = {}, Data = {}> {
  logger: KeyworkLogger
  event: IsomorphicFetchEvent<BoundAliases, ExpectedParams, Data>
  children: React.ReactNode
}

/**
 * Context for consuming the current `FetchEvent` in a React component.
 *
 * Note that when used with `RequestRouter`, context hooks are only available
 * when a React component is returned by a route handler:
 *
 * ```tsx
 * const PageComponent: React.FC = () => {
 *   const { params } = useParams()
 *   return <div>Foo</div>
 *
 * const app = new RequestRouter()
 *
 * app.get('/foo', () => {
 *  return <PageComponent />
 * })
 * ```
 *
 * If you need to access the `FetchEvent` before the React component is rendered,
 * use the `event` parameter passed to the route handler.
 */
export const FetchEventProvider: React.FC<FetchEventProviderProps> = ({ logger, event, children }) => {
  return (
    <KeyworkLoggerContext.Provider value={logger}>
      <EnvironmentContext.Provider value={event.env}>
        <RequestContext.Provider value={event.request}>
          <URLPatternResultContext.Provider value={event.match}>{children}</URLPatternResultContext.Provider>
        </RequestContext.Provider>
      </EnvironmentContext.Provider>
    </KeyworkLoggerContext.Provider>
  )
}
