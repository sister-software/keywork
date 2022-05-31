# Class: RedirectHandler

A higher-order function for redirecting requests via `IncomingRequestHandler`.

**`returns`** The incoming request handler.

**`example`**
Creating a Worker that just redirects incoming requests.

```ts
const redirectToExample = new RedirectHandler('https://example.com')

export default redirectToExample
```

## Hierarchy

- [`KeyworkRequestHandler`](KeyworkRequestHandler.md)

  ↳ **`RedirectHandler`**

## Table of contents

### Constructors

- [constructor](RedirectHandler.md#constructor)

### Properties

- [destinationURL](RedirectHandler.md#destinationurl)
- [logger](RedirectHandler.md#logger)
- [onRequest](RedirectHandler.md#onrequest)
- [onRequestDelete](RedirectHandler.md#onrequestdelete)
- [onRequestGet](RedirectHandler.md#onrequestget)
- [onRequestHead](RedirectHandler.md#onrequesthead)
- [onRequestOptions](RedirectHandler.md#onrequestoptions)
- [onRequestPatch](RedirectHandler.md#onrequestpatch)
- [onRequestPost](RedirectHandler.md#onrequestpost)
- [onRequestPut](RedirectHandler.md#onrequestput)
- [statusCode](RedirectHandler.md#statuscode)

### Methods

- [fetch](RedirectHandler.md#fetch)

## Constructors

### constructor

• **new RedirectHandler**(`destinationURL`, `statusCode?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destinationURL` | `string` \| `URL` | `undefined` |
| `statusCode` | `number` | `StatusCodes.MOVED_TEMPORARILY` |

#### Overrides

[KeyworkRequestHandler](KeyworkRequestHandler.md).[constructor](KeyworkRequestHandler.md#constructor)

#### Defined in

[src/requests/RedirectHandler.ts:36](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/RedirectHandler.ts#L36)

## Properties

### destinationURL

• **destinationURL**: `string` \| `URL`

___

### logger

• **logger**: `PrefixedLogger`

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[logger](KeyworkRequestHandler.md#logger)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:105](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L105)

___

### onRequest

• **onRequest**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming request handler for all HTTP methods.

**`remarks`** This will always be a lower priority than an explicitly defined method handler.

#### Overrides

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequest](KeyworkRequestHandler.md#onrequest)

#### Defined in

[src/requests/RedirectHandler.ts:45](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/RedirectHandler.ts#L45)

___

### onRequestDelete

• `Optional` **onRequestDelete**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `DELETE` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestDelete](KeyworkRequestHandler.md#onrequestdelete)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:73](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L73)

___

### onRequestGet

• `Optional` **onRequestGet**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `GET` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestGet](KeyworkRequestHandler.md#onrequestget)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:53](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L53)

___

### onRequestHead

• `Optional` **onRequestHead**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `HEAD` request handler.

**`see`** `WorkerRouteHandler`

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestHead](KeyworkRequestHandler.md#onrequesthead)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:79](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L79)

___

### onRequestOptions

• `Optional` **onRequestOptions**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `OPTIONS` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestOptions](KeyworkRequestHandler.md#onrequestoptions)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:84](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L84)

___

### onRequestPatch

• `Optional` **onRequestPatch**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `PATCH` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestPatch](KeyworkRequestHandler.md#onrequestpatch)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:68](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L68)

___

### onRequestPost

• `Optional` **onRequestPost**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `POST` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestPost](KeyworkRequestHandler.md#onrequestpost)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:58](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L58)

___

### onRequestPut

• `Optional` **onRequestPut**: [`IncomingRequestHandler`](../modules.md#incomingrequesthandler)<``null``, ``null``\>

An incoming `PUT` request handler.

#### Inherited from

[KeyworkRequestHandler](KeyworkRequestHandler.md).[onRequestPut](KeyworkRequestHandler.md#onrequestput)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:63](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L63)

___

### statusCode

• **statusCode**: `number` = `StatusCodes.MOVED_TEMPORARILY`

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

[KeyworkRequestHandler](KeyworkRequestHandler.md).[fetch](KeyworkRequestHandler.md#fetch)

#### Defined in

[src/requests/KeyworkRequestHandler.ts:133](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/KeyworkRequestHandler.ts#L133)
