import { DefaultWorkerBindings } from '../bindings/index.js'
import type { KeyworkSession } from '../KeyworkSession.js'

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestWithCFProperties extends Request {
  cf: IncomingRequestCfProperties
}

export interface WorkerRouteHandlerData<Params extends {} | null = null, BoundAliases extends {} | null = null> {
  request: RequestWithCFProperties
  env: BoundAliases extends null ? DefaultWorkerBindings : BoundAliases & DefaultWorkerBindings
  params: Params
  context: ExecutionContext
  session: KeyworkSession
}

export type WorkerRouteHandler<Params extends {} | null = null, BoundAliases extends {} | null = null> = (
  data: WorkerRouteHandlerData<Params, BoundAliases>
) => Response | Promise<Response>
