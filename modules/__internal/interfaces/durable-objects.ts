/* eslint-disable header/header */
/**
 * @file This file is part of the Miniflare project.
 * @see {@link https://github.com/cloudflare/miniflare}
 */

/** @internal */
declare const kFetch: unique symbol
/** @internal */
declare const kInstance: unique symbol
/** @internal */
declare const kObjectName: unique symbol

/** @internal */
export declare interface NewUniqueIdOptions {
  jurisdiction?: string
}
/** @internal */
export interface DurableObject {
  fetch(request: globalThis.Request): Promise<globalThis.Response>
}

/** @internal */
export interface DurableObjectConstructor {
  new (state: DurableObjectState, env: any): DurableObject
}

/** @internal */
export declare class DurableObjectError extends Error {}

/** @internal */
export type DurableObjectErrorCode =
  | 'ERR_SCRIPT_NOT_FOUND'
  | 'ERR_CLASS_NOT_FOUND'
  | 'ERR_RESPONSE_TYPE'
  | 'ERR_DESERIALIZATION'
  | 'ERR_NO_HANDLER'

/** @internal */
export type DurableObjectFactory = (id: DurableObjectId) => Promise<DurableObjectState>

/** @internal */
export interface DurableObjectGetOptions {
  allowConcurrency?: boolean
  noCache?: boolean
}

/** @internal */
export declare class DurableObjectId {
  #private
  readonly name?: string | undefined;
  readonly [kObjectName]: string
  constructor(objectName: string, hexId: string, name?: string | undefined)
  equals(other: DurableObjectId): boolean
  toString(): string
}

/** @internal */
export declare interface DurableObjectListOptions extends DurableObjectGetOptions {
  start?: string
  end?: string
  prefix?: string
  reverse?: boolean
  limit?: number
}

/** @internal */
export declare class DurableObjectNamespace {
  #private
  constructor(objectName: string, factory: DurableObjectFactory, ctx?: any)
  newUniqueId(_options?: NewUniqueIdOptions): DurableObjectId
  idFromName(name: string): DurableObjectId
  idFromString(hexId: string): DurableObjectId
  get(id: DurableObjectId): DurableObjectStub
}

/** @internal */
export declare class DurableObjectState {
  #private
  readonly id: DurableObjectId
  readonly storage: any;
  [kInstance]?: DurableObject
  constructor(id: DurableObjectId, storage: any)
  waitUntil(_promise: Promise<void>): void
  blockConcurrencyWhile<T>(closure: () => Promise<T>): Promise<T>
  [kFetch](request: globalThis.Request): Promise<globalThis.Response>
}

/** @internal */
export declare class DurableObjectStub {
  #private
  readonly id: DurableObjectId
  constructor(factory: DurableObjectFactory, id: DurableObjectId, ctx?: any)
  get name(): string | undefined
  fetch(input: RequestInfo, init?: RequestInit): Promise<globalThis.Response>
}
