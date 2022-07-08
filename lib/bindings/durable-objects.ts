/* eslint-disable header/header */
/**
 * @file This file is part of the Miniflare project.
 * @see {@link https://github.com/cloudflare/miniflare}
 */

/** @ignore */
declare const kFetch: unique symbol
/** @ignore */
declare const kInstance: unique symbol
/** @ignore */
declare const kObjectName: unique symbol

/** @ignore */
export declare interface NewUniqueIdOptions {
  jurisdiction?: string
}
/** @ignore */
export interface DurableObject {
  fetch(request: Request): Promise<Response>
}

/** @ignore */
export interface DurableObjectConstructor {
  new (state: DurableObjectState, env: any): DurableObject
}

/** @ignore */
export declare class DurableObjectError extends Error {}

/** @ignore */
export type DurableObjectErrorCode =
  | 'ERR_SCRIPT_NOT_FOUND'
  | 'ERR_CLASS_NOT_FOUND'
  | 'ERR_RESPONSE_TYPE'
  | 'ERR_DESERIALIZATION'
  | 'ERR_NO_HANDLER'

/** @ignore */
export type DurableObjectFactory = (id: DurableObjectId) => Promise<DurableObjectState>

/** @ignore */
export interface DurableObjectGetOptions {
  allowConcurrency?: boolean
  noCache?: boolean
}

/** @ignore */
export declare class DurableObjectId {
  #private
  readonly name?: string | undefined;
  readonly [kObjectName]: string
  constructor(objectName: string, hexId: string, name?: string | undefined)
  equals(other: DurableObjectId): boolean
  toString(): string
}

/** @ignore */
export declare interface DurableObjectListOptions extends DurableObjectGetOptions {
  start?: string
  end?: string
  prefix?: string
  reverse?: boolean
  limit?: number
}

/** @ignore */
export declare class DurableObjectNamespace {
  #private
  constructor(objectName: string, factory: DurableObjectFactory, ctx?: any)
  newUniqueId(_options?: NewUniqueIdOptions): DurableObjectId
  idFromName(name: string): DurableObjectId
  idFromString(hexId: string): DurableObjectId
  get(id: DurableObjectId): DurableObjectStub
}

/** @ignore */
export declare class DurableObjectState {
  #private
  readonly id: DurableObjectId
  readonly storage: any;
  [kInstance]?: DurableObject
  constructor(id: DurableObjectId, storage: any)
  waitUntil(_promise: Promise<void>): void
  blockConcurrencyWhile<T>(closure: () => Promise<T>): Promise<T>
  [kFetch](request: Request): Promise<Response>
}

/** @ignore */
export declare class DurableObjectStub {
  #private
  readonly id: DurableObjectId
  constructor(factory: DurableObjectFactory, id: DurableObjectId, ctx?: any)
  get name(): string | undefined
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}
