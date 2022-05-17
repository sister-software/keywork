import { ErrorResponse, JSONResponse, KeyworkSession, WorkerRouteHandler } from '@keywork/responder'
import { KeyworkQueryParamKeys, PrefixedLogger } from '@keywork/shared'
import { SSRPropsLike } from './ssr/props.mjs'
import { createStaticPropsResponse } from './StaticPropsResponse'
// import { GA } from '~site/worker/analytics/ga.js'
// import { HitType } from '~site/worker/analytics/types.js'

const logger = new PrefixedLogger('Static Props', 'cyan')

export type GetStaticProps<StaticProps, Params = {}> = (params: Params, session: KeyworkSession) => Promise<StaticProps>

export function createStaticPropsHandler<StaticProps = unknown, Params extends {} | null = null>(
  getStaticProps: GetStaticProps<StaticProps, Params>
): WorkerRouteHandler<Params> {
  const onRequestStaticProps: WorkerRouteHandler<Params> = async ({ request, params, session }) => {
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

    // TODO: This needs refining.
    const routeRecords = new Map()
    const response = await createStaticPropsResponse(request, routeRecords, staticProps as unknown as SSRPropsLike)

    if (session.isNewSession) {
      session.assignSessionHeaders(response.headers)
    }

    return response
  }

  return onRequestStaticProps
}
