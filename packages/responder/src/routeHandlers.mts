import { CommonWorkerEnvironmentBindings, EnvironmentBindingLike } from './bindings.mjs'
import type { KeyworkSession } from './session.mjs'

export interface RequestWithCFProperties extends Request {
  cf: IncomingRequestCfProperties
}

interface WorkerRouteHandlerData<Params extends {} | null = null, BoundAliases extends EnvironmentBindingLike = {}> {
  request: RequestWithCFProperties
  env: CommonWorkerEnvironmentBindings<BoundAliases>
  params: Params
  context: ExecutionContext
  session: KeyworkSession
}

export type WorkerRouteHandler<Params extends {} | null = null, BoundAliases extends EnvironmentBindingLike = {}> = (
  data: WorkerRouteHandlerData<Params, BoundAliases>
) => Response | Promise<Response>
