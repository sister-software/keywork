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

import React, { useMemo } from 'https://esm.sh/react@18.2.0'
import { MiddlewareProvider } from '../../components/mod.ts'
import { ServerEffectQueue } from '../../hooks/mod.ts'
import {
  HTMLResponse,
  HTTPMethod,
  isMethodAllowed,
  ResponseHandler,
  ResponseHandlerContext,
  ResponseLike,
  useResponseHandler,
} from '../../http/mod.ts'
import { CORSMiddleware } from '../../middleware/classes/CORSMiddleware.tsx'
import { createContextAndNamedHook, KeyworkRenderOptions, renderJSXToStream } from '../../react/mod.ts'
import { renderReactStream } from '../../react/worker/stream.ts'
import { FetchEventHandler } from '../interfaces/mod.ts'
import { ServerRouter } from "./ServerRouter.tsx";

const [RequestContext, useRequest] = createContextAndNamedHook<Request>(undefined, 'RequestContext')




export const RequestHandler: React.FC<RequestHandlerProps> = ({ children, onResponse }) => {
  const responseHandler = useResponseHandler()

  return null
}


export interface RequestRouterProps {
  displayName?: string
  children: RequestHandlerChildren
}






export function respondWithJSX(
  router: React.ReactElement<RequestRouterProps>,
  renderOptions: KeyworkRenderOptions = { streamRenderer: renderReactStream }
): FetchEventHandler {
  const responseHandler = new ResponseHandler(renderOptions)

  const fetch: FetchEventHandler = async (initialRequest, env, event) => {
    const serverEffectQueue = new ServerEffectQueue()
    // const onResponse: ResponseLikeCallback = async (responseLike) => {
    //   const response = await responseHandler.convert(responseLike)

    //   resolve(response)
    // }


    return new HTMLResponse(stream)
  }

  return fetch
}

const app = new ServerRouter(
  <>
    <CORSMiddleware>
      <RequestRouter>
        <RequestHandler pathname="/" allowedMethods="GET">
          This is the home page.
        </RequestHandler>

        <RequestHandler pathname="/profile" allowedMethods="GET">
          This is the profile page.
        </RequestHandler>

        <RequestHandler pathname="/users" allowedMethods="POST">
          This creates a user.
        </RequestHandler>
      </RequestRouter>
    </CORSMiddleware>
    </>
)



export default {
  fetch:
  ),
}
