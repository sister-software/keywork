# Class: KeyworkRequestHandler<BoundAliases\>

An extendable base class for handling incoming requests from a Worker.

In the "Module Worker" format, incoming HTTP events are handled by defining and exporting an object with method handlers corresponding to event names.

To create a route handler, start by first extending the `KeyworkRequestHandler` class.
Your implementation must at least include a `onRequestGet` handler, or a method-agnostic `onRequest` handler.

## Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |

## Hierarchy

- `ExportedHandler`<`BoundAliases`\>

  ↳ **`KeyworkRequestHandler`**

  ↳↳ [`KeyworkAssetHandler`](KeyworkAssetHandler.md)

  ↳↳ [`RedirectHandler`](RedirectHandler.md)

## Table of contents

### Constructors

- [constructor](KeyworkRequestHandler.md#constructor)

### Properties

- [logger](KeyworkRequestHandler.md#logger)
- [onRequest](KeyworkRequestHandler.md#onrequest)
- [onRequestDelete](KeyworkRequestHandler.md#onrequestdelete)
- [onRequestGet](KeyworkRequestHandler.md#onrequestget)
- [onRequestHead](KeyworkRequestHandler.md#onrequesthead)
- [onRequestOptions](KeyworkRequestHandler.md#onrequestoptions)
- [onRequestPatch](KeyworkRequestHandler.md#onrequestpatch)
- [onRequestPost](KeyworkRequestHandler.md#onrequestpost)
- [onRequestPut](KeyworkRequestHandler.md#onrequestput)

### Methods

- [fetch](KeyworkRequestHandler.md#fetch)
- [getHandlerForMethod](KeyworkRequestHandler.md#gethandlerformethod)

## Constructors

### constructor

• **new KeyworkRequestHandler**<`BoundAliases`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends ``null`` \| {} = ``null`` |

#### Inherited from

ExportedHandler<BoundAliases\>.constructor

## Properties

### logger

• **logger**: `PrefixedLogger`

#### Defined in

[src/requests/KeyworkRequestHandler.ts:105](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L105)

___

### onRequest

• `Optional` **onRequest**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming request handler for all HTTP methods.

**`remarks`** This will always be a lower priority than an explicitly defined method handler.

#### Defined in

[src/requests/KeyworkRequestHandler.ts:91](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L91)

___

### onRequestDelete

• `Optional` **onRequestDelete**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `DELETE` request handler.

#### Defined in

[src/requests/KeyworkRequestHandler.ts:73](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L73)

___

### onRequestGet

• `Optional` **onRequestGet**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `GET` request handler.

#### Defined in

[src/requests/KeyworkRequestHandler.ts:53](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L53)

___

### onRequestHead

• `Optional` **onRequestHead**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `HEAD` request handler.

**`see`** `WorkerRouteHandler`

#### Defined in

[src/requests/KeyworkRequestHandler.ts:79](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L79)

___

### onRequestOptions

• `Optional` **onRequestOptions**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `OPTIONS` request handler.

#### Defined in

[src/requests/KeyworkRequestHandler.ts:84](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L84)

___

### onRequestPatch

• `Optional` **onRequestPatch**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `PATCH` request handler.

#### Defined in

[src/requests/KeyworkRequestHandler.ts:68](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L68)

___

### onRequestPost

• `Optional` **onRequestPost**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `POST` request handler.

#### Defined in

[src/requests/KeyworkRequestHandler.ts:58](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L58)

___

### onRequestPut

• `Optional` **onRequestPut**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `PUT` request handler.

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
| `env` | `BoundAliases` |
| `context` | `ExecutionContext` |

#### Returns

`Response` \| `Promise`<`Response`\>

#### Inherited from

ExportedHandler.fetch

#### Defined in

[src/requests/KeyworkRequestHandler.ts:133](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L133)

___

### getHandlerForMethod

▸ `Private` **getHandlerForMethod**(`method`): `undefined` \| [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | [`HTTPMethod`](../modules.md#httpmethod) |

#### Returns

`undefined` \| [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

#### Defined in

[src/requests/KeyworkRequestHandler.ts:107](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L107)
