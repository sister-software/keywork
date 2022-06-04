# Class: KeyworkRequestHandler<BoundAliases\>

[keywork](../modules/keywork.md).KeyworkRequestHandler

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

  ↳↳ [`RedirectHandler`](keywork.RedirectHandler.md)

## Table of contents

### Constructors

- [constructor](keywork.KeyworkRequestHandler.md#constructor)

### Properties

- [getHandlerForMethod](keywork.KeyworkRequestHandler.md#gethandlerformethod)
- [logger](keywork.KeyworkRequestHandler.md#logger)
- [onRequest](keywork.KeyworkRequestHandler.md#onrequest)
- [onRequestDelete](keywork.KeyworkRequestHandler.md#onrequestdelete)
- [onRequestGet](keywork.KeyworkRequestHandler.md#onrequestget)
- [onRequestHead](keywork.KeyworkRequestHandler.md#onrequesthead)
- [onRequestOptions](keywork.KeyworkRequestHandler.md#onrequestoptions)
- [onRequestPatch](keywork.KeyworkRequestHandler.md#onrequestpatch)
- [onRequestPost](keywork.KeyworkRequestHandler.md#onrequestpost)
- [onRequestPut](keywork.KeyworkRequestHandler.md#onrequestput)

### Methods

- [fetch](keywork.KeyworkRequestHandler.md#fetch)

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

### getHandlerForMethod

• `Private` **getHandlerForMethod**: `any`

#### Defined in

packages/keywork/dist/index.d.ts:399

___

### logger

• **logger**: `PrefixedLogger`

#### Defined in

packages/keywork/dist/index.d.ts:398

___

### onRequest

• `Optional` **onRequest**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming request handler for all HTTP methods.

**`remarks`** This will always be a lower priority than an explicitly defined method handler.

#### Defined in

packages/keywork/dist/index.d.ts:384

___

### onRequestDelete

• `Optional` **onRequestDelete**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `DELETE` request handler.

#### Defined in

packages/keywork/dist/index.d.ts:367

___

### onRequestGet

• `Optional` **onRequestGet**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `GET` request handler.

#### Defined in

packages/keywork/dist/index.d.ts:347

___

### onRequestHead

• `Optional` **onRequestHead**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `HEAD` request handler.

**`see`** `WorkerRouteHandler`

#### Defined in

packages/keywork/dist/index.d.ts:373

___

### onRequestOptions

• `Optional` **onRequestOptions**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `OPTIONS` request handler.

#### Defined in

packages/keywork/dist/index.d.ts:378

___

### onRequestPatch

• `Optional` **onRequestPatch**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `PATCH` request handler.

#### Defined in

packages/keywork/dist/index.d.ts:362

___

### onRequestPost

• `Optional` **onRequestPost**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `POST` request handler.

#### Defined in

packages/keywork/dist/index.d.ts:352

___

### onRequestPut

• `Optional` **onRequestPut**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<`BoundAliases`, ``null``\>

An incoming `PUT` request handler.

#### Defined in

packages/keywork/dist/index.d.ts:357

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

packages/keywork/dist/index.d.ts:405
