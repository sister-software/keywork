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

import { EnvironmentContext } from 'keywork/contexts/EnvironmentContext'
import { LoggerContext } from 'keywork/contexts/LoggerContext'
import { RequestContext } from 'keywork/contexts/RequestContext'
import { URLMatchContext } from 'keywork/contexts/URLMatchContext'
import { IsomorphicFetchEvent } from 'keywork/events'
import { DEFAULT_LOG_LEVEL, LogLevel } from 'keywork/logger'

interface MiddlewareContextProps {
  logLevel?: LogLevel
  event: IsomorphicFetchEvent<any, any, any>
  children: React.ReactNode | React.ReactNode[]
}

/**
 * Context for consuming the current `FetchEvent` in a React component.
 *
 * Note that when used with `RequestRouter`, context hooks are only available
 * within the React component returned by a route handler:
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
export const FetchEventProvider: React.FC<MiddlewareContextProps> = ({
  event,
  logLevel = DEFAULT_LOG_LEVEL,
  children,
}) => {
  return (
    <LoggerContext.Provider value={logLevel}>
      <EnvironmentContext.Provider value={event.env}>
        <RequestContext.Provider value={event.request}>
          <URLMatchContext.Provider value={event.match}>{children}</URLMatchContext.Provider>
        </RequestContext.Provider>
      </EnvironmentContext.Provider>
    </LoggerContext.Provider>
  )
}
