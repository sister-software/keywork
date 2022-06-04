# Class: NotModifiedResponse

[keywork](../modules/keywork.md).NotModifiedResponse

Given that a request's etag header matches an server entity or resource,
a `NotModifiedResponse` should be sent to the requestor as an indication that the client's cache is still applicable.

## Hierarchy

- `Response`

  ↳ **`NotModifiedResponse`**

## Table of contents

### Constructors

- [constructor](keywork.NotModifiedResponse.md#constructor)

## Constructors

### constructor

• **new NotModifiedResponse**(`etag`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `etag` | `string` |

#### Overrides

Response.constructor

#### Defined in

packages/keywork/dist/index.d.ts:459
