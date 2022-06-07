---
title: "Class: KeyworkRequestHandler"
sidebar_label: "KeyworkRequestHandler"
sidebar_class_name: "doc-kind-class"
---

# Class: KeyworkRequestHandler<BoundAliases, StaticProps\>

[keywork](../modules/keywork).KeyworkRequestHandler

An extendable base class for handling incoming requests from a Worker.

In the "Module Worker" format, incoming HTTP events are handled by defining and exporting an object with method handlers corresponding to event names.

To create a route handler, start by first extending the `KeyworkRequestHandler` class.
Your implementation must at least include a `onRequestGet` handler, or a method-agnostic `onRequest` handler.

- Always attempt to handle runtime errors gracefully, and respond with `KeyworkResourceError` when necessary.

## Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |
| `StaticProps` | extends {} \| ``null`` = ``null`` |

## Hierarchy

- **`KeyworkRequestHandler`**

  ↳ [`RedirectHandler`](keywork.RedirectHandler)

## Constructors

### constructor

• **new KeyworkRequestHandler**<`BoundAliases`, `StaticProps`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends ``null`` \| {} = ``null`` |
| `StaticProps` | extends ``null`` \| {} = ``null`` |

## Properties

### getHandlerForMethod

• `Private` **getHandlerForMethod**: `any`

#### Defined in

packages/keywork/dist/index.d.ts:355

___

### logger

• **logger**: `PrefixedLogger`

A server-side logger.

#### Defined in

packages/keywork/dist/index.d.ts:314

## Methods

### fetch

▸ **fetch**(`request`, `env`, `context`): `Response` \| `Promise`<`Response`\>

The Worker's primary incoming fetch handler. This delegates to a method-specfic handler you define, such as `onGetRequest`.

**`remarks`** Generally, `KeyworkRequestHandler#fetch` should not be used within your app.
This is instead automatically called by the Worker runtime when an incoming request is received.

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request` |
| `env` | `BoundAliases` |
| `context` | `ExecutionContext` |

#### Returns

`Response` \| `Promise`<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:361

___

### getStaticProps

▸ `Optional` **getStaticProps**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`StaticProps`\>

A method used to fetch static props for rendering React apps in your worker.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`StaticProps`\>

#### Defined in

packages/keywork/dist/index.d.ts:352

___

### onRequest

▸ `Optional` **onRequest**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming request handler for all HTTP methods.

**`remarks`** This will always be a lower priority than an explicitly defined method handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:348

___

### onRequestDelete

▸ `Optional` **onRequestDelete**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `DELETE` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:334

___

### onRequestGet

▸ `Optional` **onRequestGet**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `GET` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:318

___

### onRequestHead

▸ `Optional` **onRequestHead**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `HEAD` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:338

___

### onRequestOptions

▸ `Optional` **onRequestOptions**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `OPTIONS` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:342

___

### onRequestPatch

▸ `Optional` **onRequestPatch**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `PATCH` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:330

___

### onRequestPost

▸ `Optional` **onRequestPost**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `POST` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:322

___

### onRequestPut

▸ `Optional` **onRequestPut**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `PUT` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:326
