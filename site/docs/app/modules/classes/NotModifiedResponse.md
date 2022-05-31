# Class: NotModifiedResponse

Given that a request's etag header matches an server entity or resource,
a `NotModifiedResponse` should be sent to the requestor as an indication that the client's cache is still applicable.

## Hierarchy

- `Response`

  ↳ **`NotModifiedResponse`**

## Table of contents

### Constructors

- [constructor](NotModifiedResponse.md#constructor)

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

[src/responses/NotModifiedResponse.ts:24](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/responses/NotModifiedResponse.ts#L24)
