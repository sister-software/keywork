import { CommonWorkerEnvironmentBindings, EnvironmentBindingLike } from './index.mjs'
import type { KeyworkSession } from './KeyworkSession.mjs'

export interface RequestWithCFProperties extends Request {
  cf: IncomingRequestCfProperties
}

export interface WorkerRouteHandlerData<
  Params extends {} | null = null,
  BoundAliases extends EnvironmentBindingLike = {}
> {
  request: RequestWithCFProperties
  env: CommonWorkerEnvironmentBindings<BoundAliases>
  params: Params
  context: ExecutionContext
  session: KeyworkSession
}

export type WorkerRouteHandler<Params extends {} | null = null, BoundAliases extends EnvironmentBindingLike = {}> = (
  data: WorkerRouteHandlerData<Params, BoundAliases>
) => Response | Promise<Response>
