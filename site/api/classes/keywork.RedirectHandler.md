# Class: RedirectHandler

[keywork](../modules/keywork.md).RedirectHandler

A higher-order function for redirecting requests via `IncomingRequestHandler`.

**`returns`** The incoming request handler.

**`example`**
Creating a Worker that just redirects incoming requests.

```ts
const redirectToExample = new RedirectHandler('https://example.com')

export default redirectToExample
```

## Hierarchy

- [`KeyworkRequestHandler`](keywork.KeyworkRequestHandler.md)

  ↳ **`RedirectHandler`**

## Table of contents

### Constructors

- [constructor](keywork.RedirectHandler.md#constructor)

### Properties

- [destinationURL](keywork.RedirectHandler.md#destinationurl)
- [logger](keywork.RedirectHandler.md#logger)
- [onRequest](keywork.RedirectHandler.md#onrequest)
- [onRequestDelete](keywork.RedirectHandler.md#onrequestdelete)
- [onRequestGet](keywork.RedirectHandler.md#onrequestget)
- [onRequestHead](keywork.RedirectHandler.md#onrequesthead)
- [onRequestOptions](keywork.RedirectHandler.md#onrequestoptions)
- [onRequestPatch](keywork.RedirectHandler.md#onrequestpatch)
- [onRequestPost](keywork.RedirectHandler.md#onrequestpost)
- [onRequestPut](keywork.RedirectHandler.md#onrequestput)
- [statusCode](keywork.RedirectHandler.md#statuscode)

### Methods

- [fetch](keywork.RedirectHandler.md#fetch)

## Constructors

### constructor

• **new RedirectHandler**(`destinationURL`, `statusCode?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationURL` | `string` \| `URL` |
| `statusCode?` | `number` |

#### Overrides

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[constructor](keywork.KeyworkRequestHandler.md#constructor)

#### Defined in

packages/keywork/dist/index.d.ts:562

## Properties

### destinationURL

• **destinationURL**: `string` \| `URL`

URL A url-like string or URL object

#### Defined in

packages/keywork/dist/index.d.ts:559

___

### logger

• **logger**: `PrefixedLogger`

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[logger](keywork.KeyworkRequestHandler.md#logger)

#### Defined in

packages/keywork/dist/index.d.ts:398

___

### onRequest

• **onRequest**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming request handler for all HTTP methods.

**`remarks`** This will always be a lower priority than an explicitly defined method handler.

#### Overrides

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequest](keywork.KeyworkRequestHandler.md#onrequest)

#### Defined in

packages/keywork/dist/index.d.ts:567

___

### onRequestDelete

• `Optional` **onRequestDelete**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `DELETE` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequestDelete](keywork.KeyworkRequestHandler.md#onrequestdelete)

#### Defined in

packages/keywork/dist/index.d.ts:367

___

### onRequestGet

• `Optional` **onRequestGet**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `GET` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequestGet](keywork.KeyworkRequestHandler.md#onrequestget)

#### Defined in

packages/keywork/dist/index.d.ts:347

___

### onRequestHead

• `Optional` **onRequestHead**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `HEAD` request handler.

**`see`** `WorkerRouteHandler`

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequestHead](keywork.KeyworkRequestHandler.md#onrequesthead)

#### Defined in

packages/keywork/dist/index.d.ts:373

___

### onRequestOptions

• `Optional` **onRequestOptions**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `OPTIONS` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequestOptions](keywork.KeyworkRequestHandler.md#onrequestoptions)

#### Defined in

packages/keywork/dist/index.d.ts:378

___

### onRequestPatch

• `Optional` **onRequestPatch**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `PATCH` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequestPatch](keywork.KeyworkRequestHandler.md#onrequestpatch)

#### Defined in

packages/keywork/dist/index.d.ts:362

___

### onRequestPost

• `Optional` **onRequestPost**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `POST` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequestPost](keywork.KeyworkRequestHandler.md#onrequestpost)

#### Defined in

packages/keywork/dist/index.d.ts:352

___

### onRequestPut

• `Optional` **onRequestPut**: [`IncomingRequestHandler`](../modules/keywork.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `PUT` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[onRequestPut](keywork.KeyworkRequestHandler.md#onrequestput)

#### Defined in

packages/keywork/dist/index.d.ts:357

___

### statusCode

• **statusCode**: `number`

An optional status code. Defaults to `302`

#### Defined in

packages/keywork/dist/index.d.ts:561

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

[KeyworkRequestHandler](keywork.KeyworkRequestHandler.md).[fetch](keywork.KeyworkRequestHandler.md#fetch)

#### Defined in

packages/keywork/dist/index.d.ts:405
