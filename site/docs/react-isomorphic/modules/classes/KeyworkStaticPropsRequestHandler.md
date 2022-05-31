# Class: KeyworkStaticPropsRequestHandler<StaticProps, BoundAliases\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `StaticProps` | extends [`SSRPropsLike`](../modules.md#ssrpropslike) |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |

## Hierarchy

- `KeyworkRequestHandler`<`BoundAliases`\>

  ↳ **`KeyworkStaticPropsRequestHandler`**

## Table of contents

### Constructors

- [constructor](KeyworkStaticPropsRequestHandler.md#constructor)

### Properties

- [DocumentComponent](KeyworkStaticPropsRequestHandler.md#documentcomponent)
- [PageComponent](KeyworkStaticPropsRequestHandler.md#pagecomponent)
- [Providers](KeyworkStaticPropsRequestHandler.md#providers)
- [getStaticProps](KeyworkStaticPropsRequestHandler.md#getstaticprops)
- [logger](KeyworkStaticPropsRequestHandler.md#logger)
- [onRequest](KeyworkStaticPropsRequestHandler.md#onrequest)
- [onRequestDelete](KeyworkStaticPropsRequestHandler.md#onrequestdelete)
- [onRequestGet](KeyworkStaticPropsRequestHandler.md#onrequestget)
- [onRequestHead](KeyworkStaticPropsRequestHandler.md#onrequesthead)
- [onRequestOptions](KeyworkStaticPropsRequestHandler.md#onrequestoptions)
- [onRequestPatch](KeyworkStaticPropsRequestHandler.md#onrequestpatch)
- [onRequestPost](KeyworkStaticPropsRequestHandler.md#onrequestpost)
- [onRequestPut](KeyworkStaticPropsRequestHandler.md#onrequestput)

### Methods

- [fetch](KeyworkStaticPropsRequestHandler.md#fetch)

## Constructors

### constructor

• **new KeyworkStaticPropsRequestHandler**<`StaticProps`, `BoundAliases`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StaticProps` | extends [`SSRPropsLike`](../modules.md#ssrpropslike) |
| `BoundAliases` | extends ``null`` \| {} = ``null`` |

#### Inherited from

KeyworkRequestHandler<BoundAliases\>.constructor

## Properties

### DocumentComponent

• `Optional` `Abstract` **DocumentComponent**: [`KeyworkHTMLDocumentComponent`](../modules.md#keyworkhtmldocumentcomponent)

A HTML Document React component which wraps the entire application.
Use this if you need to replace the default HTML Document.

#### Defined in

[packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx:113](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx#L113)

___

### PageComponent

• `Abstract` **PageComponent**: `FC`<`StaticProps`\>

The React component to render for this specific page.

#### Defined in

[packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx:102](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx#L102)

___

### Providers

• `Optional` `Abstract` **Providers**: [`KeyworkProvidersComponent`](../modules.md#keyworkproviderscomponent)

A React component which wraps the SSR routes.
Use this if you need to inject a provider into the SSR pipeline.

#### Defined in

[packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx:108](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx#L108)

___

### getStaticProps

• `Abstract` **getStaticProps**: [`GetStaticPropsHandler`](../modules.md#getstaticpropshandler)<`StaticProps`, `BoundAliases`, ``null``\>

#### Defined in

[packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx:115](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx#L115)

___

### logger

• **logger**: `PrefixedLogger`

#### Inherited from

KeyworkRequestHandler.logger

#### Defined in

packages/app/dist/index.d.ts:398

___

### onRequest

• `Optional` **onRequest**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

An incoming request handler for all HTTP methods.

**`remarks`** This will always be a lower priority than an explicitly defined method handler.

#### Inherited from

KeyworkRequestHandler.onRequest

#### Defined in

packages/app/dist/index.d.ts:384

___

### onRequestDelete

• `Optional` **onRequestDelete**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

An incoming `DELETE` request handler.

#### Inherited from

KeyworkRequestHandler.onRequestDelete

#### Defined in

packages/app/dist/index.d.ts:367

___

### onRequestGet

• **onRequestGet**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

#### Overrides

KeyworkRequestHandler.onRequestGet

#### Defined in

[packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx:117](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/KeyworkStaticPropsRequestHandler.tsx#L117)

___

### onRequestHead

• `Optional` **onRequestHead**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

An incoming `HEAD` request handler.

**`see`** `WorkerRouteHandler`

#### Inherited from

KeyworkRequestHandler.onRequestHead

#### Defined in

packages/app/dist/index.d.ts:373

___

### onRequestOptions

• `Optional` **onRequestOptions**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

An incoming `OPTIONS` request handler.

#### Inherited from

KeyworkRequestHandler.onRequestOptions

#### Defined in

packages/app/dist/index.d.ts:378

___

### onRequestPatch

• `Optional` **onRequestPatch**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

An incoming `PATCH` request handler.

#### Inherited from

KeyworkRequestHandler.onRequestPatch

#### Defined in

packages/app/dist/index.d.ts:362

___

### onRequestPost

• `Optional` **onRequestPost**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

An incoming `POST` request handler.

#### Inherited from

KeyworkRequestHandler.onRequestPost

#### Defined in

packages/app/dist/index.d.ts:352

___

### onRequestPut

• `Optional` **onRequestPut**: `IncomingRequestHandler`<`BoundAliases`, ``null``\>

An incoming `PUT` request handler.

#### Inherited from

KeyworkRequestHandler.onRequestPut

#### Defined in

packages/app/dist/index.d.ts:357

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

KeyworkRequestHandler.fetch

#### Defined in

packages/app/dist/index.d.ts:405
