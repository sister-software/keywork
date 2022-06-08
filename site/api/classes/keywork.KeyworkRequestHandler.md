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
| `StaticProps` | extends [`SSRPropsLike`](../modules/keywork#ssrpropslike) = ``null`` |

## Hierarchy

- `_KeyworkRequestHandlerBase`<`BoundAliases`\>

  ↳ **`KeyworkRequestHandler`**

  ↳↳ [`KeyworkAssetHandler`](keywork.KeyworkAssetHandler)

  ↳↳ [`RedirectHandler`](keywork.RedirectHandler)

## Constructors

### constructor

• **new KeyworkRequestHandler**<`BoundAliases`, `StaticProps`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends ``null`` \| {} = ``null`` |
| `StaticProps` | extends [`SSRPropsLike`](../modules/keywork#ssrpropslike) = ``null`` |

#### Inherited from

\_KeyworkRequestHandlerBase<BoundAliases\>.constructor

## Properties

### DocumentComponent

• `Protected` `Optional` **DocumentComponent**: [`KeyworkHTMLDocumentComponent`](../modules/keywork#keyworkhtmldocumentcomponent)

A HTML Document React component which wraps the entire application.
Use this if you need to replace the default HTML Document.

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:55](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L55)

___

### PageComponent

• `Protected` `Optional` **PageComponent**: `FC`<`StaticProps`\>

The React component to render for this specific page.

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:44](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L44)

___

### Providers

• `Protected` `Optional` **Providers**: [`KeyworkProvidersComponent`](../modules/keywork#keyworkproviderscomponent)

A React component which wraps the SSR routes.
Use this if you need to inject a provider into the SSR pipeline.

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:50](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L50)

___

### getStaticProps

• `Optional` **getStaticProps**: (`data`: [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\>) => [`PossiblePromise`](../modules/keywork#possiblepromise)<`StaticProps`\>

#### Type declaration

▸ (`data`): [`PossiblePromise`](../modules/keywork#possiblepromise)<`StaticProps`\>

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
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData)<`BoundAliases`\> |

##### Returns

[`PossiblePromise`](../modules/keywork#possiblepromise)<`StaticProps`\>

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandler.ts:90](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandler.ts#L90)

___

### logger

• **logger**: [`PrefixedLogger`](keywork.PrefixedLogger)

A server-side logger.

#### Inherited from

\_KeyworkRequestHandlerBase.logger

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:43](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L43)

___

### onRequest

• **onRequest**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming request handler for all HTTP methods.

**`remarks`**
This will always be a **lower priority** than an explicitly defined method handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequest

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:106](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L106)

___

### onRequestDelete

• **onRequestDelete**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming `DELETE` request handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequestDelete

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:82](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L82)

___

### onRequestGet

• **onRequestGet**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming `GET` request handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequestGet

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:54](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L54)

___

### onRequestHead

• **onRequestHead**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming `HEAD` request handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequestHead

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:89](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L89)

___

### onRequestOptions

• **onRequestOptions**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming `OPTIONS` request handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequestOptions

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:96](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L96)

___

### onRequestPatch

• **onRequestPatch**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming `PATCH` request handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequestPatch

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:75](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L75)

___

### onRequestPost

• **onRequestPost**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming `POST` request handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequestPost

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:61](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L61)

___

### onRequestPut

• **onRequestPut**: [`IncomingRequestDataHandler`](../modules/keywork#incomingrequestdatahandler)<`BoundAliases`\>

An incoming `PUT` request handler.

#### Inherited from

\_KeyworkRequestHandlerBase.onRequestPut

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:68](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L68)

___

### pattern

• `Protected` `Readonly` **pattern**: `never`

**`deprecated`** This property should be defined as a static member.
Did you mean `static pattern = '/:foo/:bar/:baz'`

#### Inherited from

\_KeyworkRequestHandlerBase.pattern

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:38](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L38)

___

### pattern

▪ `Static` **pattern**: `string` \| [`PathPattern`](../interfaces/keywork.PathPattern)<`string`\> = `'*'`

A `path-to-regexp` style pattern.

**`see`** [NPM Package](https://www.npmjs.com/package/path-to-regexp)

#### Inherited from

\_KeyworkRequestHandlerBase.pattern

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
| `env` | `BoundAliases` |
| `context` | `ExecutionContext` |

#### Returns

`Response` \| `Promise`<`Response`\>

#### Inherited from

\_KeyworkRequestHandlerBase.fetch

#### Defined in

[packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx:153](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/requests/KeyworkRequestHandlerBase.tsx#L153)
