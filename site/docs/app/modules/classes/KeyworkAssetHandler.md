# Class: KeyworkAssetHandler

Handles incoming requests for static assets uploaded to Cloudflare KV.

**`beta`** This is under active development

## Hierarchy

- [`KeyworkRequestHandler`](KeyworkRequestHandler.md)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md)\>

  ↳ **`KeyworkAssetHandler`**

## Table of contents

### Constructors

- [constructor](KeyworkAssetHandler.md#constructor)

### Properties

- [assetManifest](KeyworkAssetHandler.md#assetmanifest)
- [logger](KeyworkAssetHandler.md#logger)
- [onRequest](KeyworkAssetHandler.md#onrequest)
- [onRequestDelete](KeyworkAssetHandler.md#onrequestdelete)
- [onRequestGet](KeyworkAssetHandler.md#onrequestget)
- [onRequestHead](KeyworkAssetHandler.md#onrequesthead)
- [onRequestOptions](KeyworkAssetHandler.md#onrequestoptions)
- [onRequestPatch](KeyworkAssetHandler.md#onrequestpatch)
- [onRequestPost](KeyworkAssetHandler.md#onrequestpost)
- [onRequestPut](KeyworkAssetHandler.md#onrequestput)

### Methods

- [fetch](KeyworkAssetHandler.md#fetch)

## Constructors

### constructor

• **new KeyworkAssetHandler**(`rawAssetManifest`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawAssetManifest` | `string` |

#### Overrides

[KeyworkRequestHandler](KeyworkRequestHandler.md).[constructor](KeyworkRequestHandler.md#constructor)

#### Defined in

[src/bindings/assets.ts:65](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/assets.ts#L65)

## Properties

### assetManifest

• `Protected` **assetManifest**: `AssetManifestType`

#### Defined in

[src/bindings/assets.ts:64](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/assets.ts#L64)

___

### logger

• **logger**: `PrefixedLogger`

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[logger](KeyworkRequestHandler.md#logger)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:105](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L105)

___

### onRequest

• `Optional` **onRequest**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming request handler for all HTTP methods.

**`remarks`** This will always be a lower priority than an explicitly defined method handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequest](KeyworkRequestHandler.md#onrequest)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:91](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L91)

___

### onRequestDelete

• `Optional` **onRequestDelete**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming `DELETE` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestDelete](KeyworkRequestHandler.md#onrequestdelete)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:73](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L73)

___

### onRequestGet

• **onRequestGet**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming `GET` request handler.

#### Overrides

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestGet](KeyworkRequestHandler.md#onrequestget)

#### Defined in

[src/bindings/assets.ts:76](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/assets.ts#L76)

___

### onRequestHead

• `Optional` **onRequestHead**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming `HEAD` request handler.

**`see`** `WorkerRouteHandler`

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestHead](KeyworkRequestHandler.md#onrequesthead)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:79](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L79)

___

### onRequestOptions

• `Optional` **onRequestOptions**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming `OPTIONS` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestOptions](KeyworkRequestHandler.md#onrequestoptions)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:84](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L84)

___

### onRequestPatch

• `Optional` **onRequestPatch**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming `PATCH` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestPatch](KeyworkRequestHandler.md#onrequestpatch)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:68](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L68)

___

### onRequestPost

• `Optional` **onRequestPost**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming `POST` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestPost](KeyworkRequestHandler.md#onrequestpost)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:58](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L58)

___

### onRequestPut

• `Optional` **onRequestPut**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<[`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md), ``null``\>

An incoming `PUT` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestPut](KeyworkRequestHandler.md#onrequestput)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:63](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L63)

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
| `env` | [`WorkersSiteStaticContentBinding`](../interfaces/WorkersSiteStaticContentBinding.md) |
| `context` | `ExecutionContext` |

#### Returns

`Response` \| `Promise`<`Response`\>

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[fetch](KeyworkRequestHandler.md#fetch)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:133](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L133)
