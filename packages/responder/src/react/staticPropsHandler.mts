import { ErrorResponse, JSONResponse } from '@keywork/responder'
import { KeyworkQueryParamKeys, PrefixedLogger } from '@keywork/shared'
import { WorkerRouteHandler } from '../routeHandlers.mjs'
import { KeyworkSession } from '../session.mjs'
import { respondWithStaticProps } from './SSRProvider.mjs'
// import { GA } from '~site/worker/analytics/ga.js'
// import { HitType } from '~site/worker/analytics/types.js'

const logger = new PrefixedLogger('Static Props', 'cyan')

export type GetStaticProps<StaticProps, Params = {}> = (
  params: Params,
  // cfClient: CloudflareWorkerClient<Env>,
  session: KeyworkSession
) => Promise<StaticProps>

export function createStaticPropsHandler<StaticProps = unknown, Params = unknown>(
  getStaticProps: GetStaticProps<StaticProps, Params>
): WorkerRouteHandler<Params> {
  const onRequestStaticProps: WorkerRouteHandler<Params> = async ({ request, params, context, session }) => {
    const location = new URL(request.url)
    const onlySendStaticProps = location.searchParams.has(KeyworkQueryParamKeys.StaticProps)

    // if (!onlySendStaticProps && process.env.NODE_ENV !== 'development') {
    //   const ga = new GA(request, session.sessionID)
    //   context.waitUntil(ga.send(HitType.PAGE_VIEW))
    // }

    let staticProps: StaticProps

    try {
      staticProps = await getStaticProps(params, session)
    } catch (error) {
      logger.error(error)
      return ErrorResponse.fromUnknownError(error)
    }

    if (onlySendStaticProps) {
      return new JSONResponse(staticProps || ({} as any))
    }

    const response = respondWithStaticProps(request, staticProps as unknown as SSRPropsLike)

    if (session.isNewSession) {
      session.assignSessionHeaders(response.headers)
    }

    return response
  }

  return onRequestStaticProps
}
