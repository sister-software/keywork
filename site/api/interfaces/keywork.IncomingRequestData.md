# Interface: IncomingRequestData<BoundAliases\>

[keywork](../modules/keywork.md).IncomingRequestData

Data associated with the incoming request.

## Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |

## Table of contents

### Properties

- [context](keywork.IncomingRequestData.md#context)
- [env](keywork.IncomingRequestData.md#env)
- [request](keywork.IncomingRequestData.md#request)
- [url](keywork.IncomingRequestData.md#url)

## Properties

### context

• `Readonly` **context**: `ExecutionContext`

An execution context for running async tasks after the response is sent.

#### Defined in

packages/keywork/dist/index.d.ts:259

___

### env

• `Readonly` **env**: `BoundAliases` extends ``null`` ? [`DefaultWorkerBindings`](../modules/keywork.md#defaultworkerbindings) : `BoundAliases` & [`WorkersSiteStaticContentBinding`](keywork.WorkersSiteStaticContentBinding.md) & `BoundAliases` & [`WorkersPagesAssetsBinding`](keywork.WorkersPagesAssetsBinding.md)

Any bound environment properties defined in your `wrangler.toml` file

#### Defined in

packages/keywork/dist/index.d.ts:257

___

### request

• `Readonly` **request**: [`RequestWithCFProperties`](keywork.RequestWithCFProperties.md)

The incoming request

#### Defined in

packages/keywork/dist/index.d.ts:253

___

### url

• `Readonly` **url**: `URL`

The incoming request URL object

#### Defined in

packages/keywork/dist/index.d.ts:255
