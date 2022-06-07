---
title: "Interface: IncomingRequestData"
sidebar_label: "IncomingRequestData"
sidebar_class_name: "doc-kind-interface"
---

# Interface: IncomingRequestData<BoundAliases\>

[keywork](../modules/keywork).IncomingRequestData

Data associated with the incoming request.

## Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |

## Properties

### context

• `Readonly` **context**: `ExecutionContext`

An execution context for running async tasks after the response is sent.

#### Defined in

packages/keywork/dist/index.d.ts:259

___

### env

• `Readonly` **env**: `BoundAliases` extends ``null`` ? [`DefaultWorkerBindings`](../modules/keywork#defaultworkerbindings) : `BoundAliases` & [`WorkersSiteStaticContentBinding`](keywork.WorkersSiteStaticContentBinding) & `BoundAliases` & [`WorkersPagesAssetsBinding`](keywork.WorkersPagesAssetsBinding)

Any bound environment properties defined in your `wrangler.toml` file

#### Defined in

packages/keywork/dist/index.d.ts:257

___

### request

• `Readonly` **request**: [`RequestWithCFProperties`](keywork.RequestWithCFProperties)

The incoming request

#### Defined in

packages/keywork/dist/index.d.ts:253

___

### url

• `Readonly` **url**: `URL`

The incoming request URL object

#### Defined in

packages/keywork/dist/index.d.ts:255
