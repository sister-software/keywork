---
title: "Class: RedirectHandler"
sidebar_label: "RedirectHandler"
sidebar_class_name: "doc-kind-class"
---

# Class: RedirectHandler

[keywork](../modules/keywork).RedirectHandler

A higher-order function for redirecting requests via `KeyworkRequestHandler`.

**`returns`** The incoming request handler.

**`example`**
Creating a Worker that just redirects incoming requests.

```ts
const redirectToExample = new RedirectHandler('https://example.com')

export default redirectToExample
```

## Hierarchy

- [`KeyworkRequestHandler`](keywork.KeyworkRequestHandler)

  ↳ **`RedirectHandler`**

## Constructors

### constructor

• **new RedirectHandler**(`destinationURL`, `statusCode?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationURL` | `string` \| `URL` |
| `statusCode?` | `number` |

#### Overrides

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[constructor](keywork.KeyworkRequestHandler#constructor)

#### Defined in

packages/keywork/dist/index.d.ts:520

## Properties

### destinationURL

• **destinationURL**: `string` \| `URL`

URL A url-like string or URL object

#### Defined in

packages/keywork/dist/index.d.ts:517

___

### logger

• **logger**: `PrefixedLogger`

A server-side logger.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[logger](keywork.KeyworkRequestHandler#logger)

#### Defined in

packages/keywork/dist/index.d.ts:314

___

### onRequest

• **onRequest**: (`__namedParameters`: [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\>) => `Response`

#### Type declaration

▸ (`__namedParameters`): `Response`

##### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

##### Returns

`Response`

#### Overrides

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequest](keywork.KeyworkRequestHandler#onrequest)

#### Defined in

packages/keywork/dist/index.d.ts:525

___

### statusCode

• **statusCode**: `number`

An optional status code. Defaults to `302`

#### Defined in

packages/keywork/dist/index.d.ts:519

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
| `env` | ``null`` |
| `context` | `ExecutionContext` |

#### Returns

`Response` \| `Promise`<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[fetch](keywork.KeyworkRequestHandler#fetch)

#### Defined in

packages/keywork/dist/index.d.ts:361

___

### getStaticProps

▸ `Optional` **getStaticProps**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<``null``\>

A method used to fetch static props for rendering React apps in your worker.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<``null``\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[getStaticProps](keywork.KeyworkRequestHandler#getstaticprops)

#### Defined in

packages/keywork/dist/index.d.ts:352

___

### onRequestDelete

▸ `Optional` **onRequestDelete**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `DELETE` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestDelete](keywork.KeyworkRequestHandler#onrequestdelete)

#### Defined in

packages/keywork/dist/index.d.ts:334

___

### onRequestGet

▸ `Optional` **onRequestGet**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `GET` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestGet](keywork.KeyworkRequestHandler#onrequestget)

#### Defined in

packages/keywork/dist/index.d.ts:318

___

### onRequestHead

▸ `Optional` **onRequestHead**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `HEAD` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestHead](keywork.KeyworkRequestHandler#onrequesthead)

#### Defined in

packages/keywork/dist/index.d.ts:338

___

### onRequestOptions

▸ `Optional` **onRequestOptions**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `OPTIONS` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestOptions](keywork.KeyworkRequestHandler#onrequestoptions)

#### Defined in

packages/keywork/dist/index.d.ts:342

___

### onRequestPatch

▸ `Optional` **onRequestPatch**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `PATCH` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestPatch](keywork.KeyworkRequestHandler#onrequestpatch)

#### Defined in

packages/keywork/dist/index.d.ts:330

___

### onRequestPost

▸ `Optional` **onRequestPost**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `POST` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestPost](keywork.KeyworkRequestHandler#onrequestpost)

#### Defined in

packages/keywork/dist/index.d.ts:322

___

### onRequestPut

▸ `Optional` **onRequestPut**(`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

An incoming `PUT` request handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`Response`\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestPut](keywork.KeyworkRequestHandler#onrequestput)

#### Defined in

packages/keywork/dist/index.d.ts:326
