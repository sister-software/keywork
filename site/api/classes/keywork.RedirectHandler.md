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

| Name | Type | Default value |
| :------ | :------ | :------ |
| `destinationURL` | `string` \| `URL` | `undefined` |
| `statusCode` | `number` | `StatusCodes.MOVED_TEMPORARILY` |

#### Overrides

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[constructor](keywork.KeyworkRequestHandler#constructor)

#### Defined in

[packages/keywork/lib/requests/RedirectHandler.ts:37](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/RedirectHandler.ts#L37)

## Properties

### DocumentComponent

• `Protected` `Optional` **DocumentComponent**: [`KeyworkHTMLDocumentComponent`](../modules/keywork#keyworkhtmldocumentcomponent)

A HTML Document React component which wraps the entire application.
Use this if you need to replace the default HTML Document.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[DocumentComponent](keywork.KeyworkRequestHandler#documentcomponent)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:55](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L55)

___

### PageComponent

• `Protected` `Optional` **PageComponent**: `FC`<``null``\>

The React component to render for this specific page.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[PageComponent](keywork.KeyworkRequestHandler#pagecomponent)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:44](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L44)

___

### Providers

• `Protected` `Optional` **Providers**: [`KeyworkProvidersComponent`](../modules/keywork#keyworkproviderscomponent)

A React component which wraps the SSR routes.
Use this if you need to inject a provider into the SSR pipeline.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[Providers](keywork.KeyworkRequestHandler#providers)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:50](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L50)

___

### destinationURL

• **destinationURL**: `string` \| `URL`

___

### getStaticProps

• `Optional` **getStaticProps**: (`data`: [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\>) => [`PossiblePromise`](../modules/keywork#possiblepromise)<``null``\>

#### Type declaration

▸ (`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<``null``\>

A method used to fetch static props for rendering React apps in your worker.

**`example`**
```ts
import { KeyworkRequestHandler, GetStaticPropsHandler } from 'keywork'
import { StaticTodoPageProps, TodoPage } from './TodoPage.tsx'

export class TodoWorker extends KeyworkRequestHandler<null, StaticTodoPageProps> {
  // A URL path pattern...
  static readonly pattern = '/todos/:todoID/'
  // And our React component from earlier.
  PageComponent = TodoPage

  async getStaticProps({ request }: IncomingRequestData): Promise<StaticTodoPageProps> {
    // Attempt to get our params from the request...
    const { params } = parsePathname<TodoRouteParams>(TodoWorker.pattern, request)
    // "Search" the database for a match...
    const todoItem = exampleTodos[params.todoID]

    if (!todoItem) {
      return new ErrorResponse(`Todo with ID ${todoItem} does not exist`, 404)
    }

    // Return the expected static props!
    return {
      todoItem,
    }
  }
}
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

##### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<``null``\>

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[getStaticProps](keywork.KeyworkRequestHandler#getstaticprops)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:90](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L90)

___

### logger

• **logger**: [`PrefixedLogger`](keywork.PrefixedLogger)

A server-side logger.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[logger](keywork.KeyworkRequestHandler#logger)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:43](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L43)

___

### onRequestDelete

• **onRequestDelete**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<``null``\>

An incoming `DELETE` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestDelete](keywork.KeyworkRequestHandler#onrequestdelete)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:82](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L82)

___

### onRequestGet

• **onRequestGet**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<``null``\>

An incoming `GET` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestGet](keywork.KeyworkRequestHandler#onrequestget)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:54](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L54)

___

### onRequestHead

• **onRequestHead**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<``null``\>

An incoming `HEAD` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestHead](keywork.KeyworkRequestHandler#onrequesthead)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:89](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L89)

___

### onRequestOptions

• **onRequestOptions**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<``null``\>

An incoming `OPTIONS` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestOptions](keywork.KeyworkRequestHandler#onrequestoptions)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:96](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L96)

___

### onRequestPatch

• **onRequestPatch**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<``null``\>

An incoming `PATCH` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestPatch](keywork.KeyworkRequestHandler#onrequestpatch)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:75](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L75)

___

### onRequestPost

• **onRequestPost**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<``null``\>

An incoming `POST` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestPost](keywork.KeyworkRequestHandler#onrequestpost)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:61](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L61)

___

### onRequestPut

• **onRequestPut**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<``null``\>

An incoming `PUT` request handler.

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[onRequestPut](keywork.KeyworkRequestHandler#onrequestput)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:68](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L68)

___

### pattern

• `Protected` `Readonly` **pattern**: `never`

**`deprecated`** This property should be defined as a static member.
Did you mean `static pattern = '/:foo/:bar/:baz'`

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[pattern](keywork.KeyworkRequestHandler#pattern)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:38](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L38)

___

### statusCode

• **statusCode**: `number` = `StatusCodes.MOVED_TEMPORARILY`

___

### pattern

▪ `Static` **pattern**: `string` \| [`PathPattern`](../interfaces/keywork.PathPattern)<`string`\> = `'*'`

A `path-to-regexp` style pattern.

**`see`** [NPM Package](https://www.npmjs.com/package/path-to-regexp)

#### Inherited from

[KeyworkRequestHandler](keywork.KeyworkRequestHandler).[pattern](keywork.KeyworkRequestHandler#pattern-1)

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:32](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L32)

## Methods

### fetch

▸ `Protected` **fetch**(`request`, `env`, `context`): `Response` \| `Promise`<`Response`\>

The Worker's primary incoming fetch handler.

**`remarks`**
This delegates to a method-specfic handler you define, such as `onGetRequest`.
Generally, `KeyworkRequestHandler#fetch` should not be used within your app.
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

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:153](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L153)

___

### onRequest

▸ **onRequest**(`__namedParameters`): `Response`

An incoming request handler for all HTTP methods.

**`remarks`**
This will always be a **lower priority** than an explicitly defined method handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<``null``\> |

#### Returns

`Response`

#### Overrides

KeyworkRequestHandler.onRequest

#### Defined in

[packages/keywork/lib/requests/RedirectHandler.ts:46](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/RedirectHandler.ts#L46)
