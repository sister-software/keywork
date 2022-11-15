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

import { renderToStaticMarkup } from 'https://esm.sh/react-dom@18.2.0/server'
import React from 'https://esm.sh/react@18.2.0'
import { MiddlewareStack, MiddlewareStackContext } from '../../contexts/MiddlewareStack.tsx'
import {
  EnvironmentContext,
  FetchEventContext,
  LoggerContext,
  MiddlewareProvider,
  RequestContext,
  ResponseEffectQueueContext,
} from '../../contexts/mod.ts'
import { IsomorphicFetchEvent } from '../../events/mod.ts'
import { MatchRequestParent } from '../../hooks/mod.ts'
import { LogLevel } from '../../logger/mod.ts'
import { KeyworkRenderOptions, renderJSXToStream } from '../../react/mod.ts'
import { renderReactStream } from '../../react/worker/stream.ts'
import { FetchEventHandler } from '../interfaces/mod.ts'

export class ServerRouter {
  constructor(
    protected children: () => MatchRequestParent,
    protected renderOptions: KeyworkRenderOptions = { streamRenderer: renderReactStream }
  ) {}

  fetch: FetchEventHandler = async (request, env = {}, fetchEvent = new IsomorphicFetchEvent('fetch', { request })) => {
    const middlewareStack = new MiddlewareStack()
    const wrappedRouter = (
      <Middleware
        request={request}
        env={env}
        fetchEvent={fetchEvent}
        effectStack={middlewareStack}
        logLevel={LogLevel.Warning}
      >
        {this.children()}
      </Middleware>
    )

    for (const nextEffect of middlewareStack) {
      await nextEffect.applyEffects()
    }

    renderToStaticMarkup(wrappedRouter)
    // await middlewareStack.
    // const initialResponse = new Response()

    const stream = await renderJSXToStream(wrappedRouter, this.renderOptions)

    return stream
  }
}

export interface ServerRouterProps {
  renderOptions?: KeyworkRenderOptions
  children: MatchRequestParent
  effectStack: MiddlewareStack
  request: Request
  env: {}
  event?: IsomorphicFetchEvent
  logLevel?: LogLevel
  fetchEvent: IsomorphicFetchEvent
}

/**
 * Context for creating a new layer of middleware.
 */
export const Middleware: React.FC<ServerRouterProps> = ({
  env,
  effectStack,
  children,
  request,
  fetchEvent,
  logLevel = LogLevel.Warning,
}) => {
  return (
    <LoggerContext.Provider value={logLevel}>
      <EnvironmentContext.Provider value={env!}>
        <RequestContext.Provider value={request}>
          <FetchEventContext.Provider value={fetchEvent}>
            <MiddlewareStackContext.Provider value={effectStack}>
              <ResponseEffectQueueContext.Provider value={effectStack}>
                <MiddlewareProvider>{children}</MiddlewareProvider>
              </ResponseEffectQueueContext.Provider>
            </MiddlewareStackContext.Provider>
          </FetchEventContext.Provider>
        </RequestContext.Provider>
      </EnvironmentContext.Provider>
    </LoggerContext.Provider>
  )
}
