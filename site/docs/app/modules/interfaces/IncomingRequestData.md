# Interface: IncomingRequestData<BoundAliases\>

Data associated with the incoming request.

## Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |

## Table of contents

### Properties

- [context](IncomingRequestData.md#context)
- [env](IncomingRequestData.md#env)
- [request](IncomingRequestData.md#request)
- [session](IncomingRequestData.md#session)
- [url](IncomingRequestData.md#url)

## Properties

### context

• `Readonly` **context**: `ExecutionContext`

An execution context for running async tasks after the response is sent.

#### Defined in

[src/requests/common.ts:35](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/common.ts#L35)

___

### env

• `Readonly` **env**: `BoundAliases` extends ``null`` ? [`DefaultWorkerBindings`](../modules.md#defaultworkerbindings) : `BoundAliases` & [`WorkersSiteStaticContentBinding`](WorkersSiteStaticContentBinding.md) & `BoundAliases` & [`WorkersPagesAssetsBinding`](WorkersPagesAssetsBinding.md)

Any bound environment properties defined in your `wrangler.toml` file

#### Defined in

[src/requests/common.ts:33](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/common.ts#L33)

___

### request

• `Readonly` **request**: [`RequestWithCFProperties`](RequestWithCFProperties.md)

The incoming request

#### Defined in

[src/requests/common.ts:29](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/common.ts#L29)

___

### session

• `Readonly` **session**: [`KeyworkSession`](../classes/KeyworkSession.md)

**`beta`**

#### Defined in

[src/requests/common.ts:37](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/common.ts#L37)

___

### url

• `Readonly` **url**: `URL`

The incoming request URL object

#### Defined in

[src/requests/common.ts:31](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/common.ts#L31)
