# Module: keywork

## Table of contents

### HTTP Responses Classes

- [CachableResponse](../classes/keywork.CachableResponse.md)
- [ErrorResponse](../classes/keywork.ErrorResponse.md)
- [HTMLResponse](../classes/keywork.HTMLResponse.md)
- [JSONResponse](../classes/keywork.JSONResponse.md)
- [NotModifiedResponse](../classes/keywork.NotModifiedResponse.md)

### Incoming Request Handlers Classes

- [KeyworkRequestHandler](../classes/keywork.KeyworkRequestHandler.md)
- [RedirectHandler](../classes/keywork.RedirectHandler.md)

### Sessions &amp; Cookies Classes

- [KeyworkSession](../classes/keywork.KeyworkSession.md)

### HTTP Responses Interfaces

- [CacheControlDirectives](../interfaces/keywork.CacheControlDirectives.md)

### Other Interfaces

- [EntityToETagOptions](../interfaces/keywork.EntityToETagOptions.md)
- [IncomingRequestData](../interfaces/keywork.IncomingRequestData.md)
- [PathMatch](../interfaces/keywork.PathMatch.md)
- [PathPattern](../interfaces/keywork.PathPattern.md)
- [RequestWithCFProperties](../interfaces/keywork.RequestWithCFProperties.md)
- [WorkersPagesAssetsBinding](../interfaces/keywork.WorkersPagesAssetsBinding.md)
- [WorkersSiteStaticContentBinding](../interfaces/keywork.WorkersSiteStaticContentBinding.md)

### Type Aliases

- [CacheControlHeader](keywork.md#cachecontrolheader)
- [ContentTypeHeader](keywork.md#contenttypeheader)
- [DefaultWorkerBindings](keywork.md#defaultworkerbindings)
- [ETaggable](keywork.md#etaggable)
- [EnvironmentBindingKinds](keywork.md#environmentbindingkinds)
- [HTTPMethod](keywork.md#httpmethod)
- [IncomingRequestHandler](keywork.md#incomingrequesthandler)
- [ParsedPathParams](keywork.md#parsedpathparams)
- [RequestLike](keywork.md#requestlike)
- [URLLike](keywork.md#urllike)
- [WorkerEnvFetchBinding](keywork.md#workerenvfetchbinding)

### Variables

- [DEFAULT\_SESSION\_COOKIE\_KEY](keywork.md#default_session_cookie_key)

### Functions

- [arrayBufferToBase64](keywork.md#arraybuffertobase64)
- [convertJSONToETaggableString](keywork.md#convertjsontoetaggablestring)
- [createCacheControlHeader](keywork.md#createcachecontrolheader)
- [fileExtensionToContentTypeHeader](keywork.md#fileextensiontocontenttypeheader)
- [fileNameToExtension](keywork.md#filenametoextension)
- [generateETag](keywork.md#generateetag)
- [getBrowserIdentifier](keywork.md#getbrowseridentifier)
- [isETagMatch](keywork.md#isetagmatch)
- [isRequestLike](keywork.md#isrequestlike)
- [isURLLike](keywork.md#isurllike)
- [matchPath](keywork.md#matchpath)
- [parsePathname](keywork.md#parsepathname)

## Type Aliases

### CacheControlHeader

Ƭ **CacheControlHeader**: `HeadersInit` & { `Cache-Control`: `string`  }

**`file`** This file is part of the Keywork project.

**`copyright`** Nirrius, LLC. All rights reserved.

**`author`** Teffen Ellis, et al.

**`license`** AGPL-3.0

**`remarks`** Keywork is free software for non-commercial purposes.
You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

**`see`** LICENSE.md in the project root for further licensing information.

#### Defined in

packages/keywork/dist/index.d.ts:58

___

### ContentTypeHeader

Ƭ **ContentTypeHeader**: `HeadersInit` & { `Content-Type`: `string`  }

**`file`** This file is part of the Keywork project.

**`copyright`** Nirrius, LLC. All rights reserved.

**`author`** Teffen Ellis, et al.

**`license`** AGPL-3.0

**`remarks`** Keywork is free software for non-commercial purposes.
You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

**`see`** LICENSE.md in the project root for further licensing information.

#### Defined in

packages/keywork/dist/index.d.ts:76

___

### DefaultWorkerBindings

Ƭ **DefaultWorkerBindings**: [`WorkersSiteStaticContentBinding`](../interfaces/keywork.WorkersSiteStaticContentBinding.md) \| [`WorkersPagesAssetsBinding`](../interfaces/keywork.WorkersPagesAssetsBinding.md)

#### Defined in

packages/keywork/dist/index.d.ts:102

___

### ETaggable

Ƭ **ETaggable**: `string` \| `ArrayBuffer`

Types that can be converted into ETags.

#### Defined in

packages/keywork/dist/index.d.ts:187

___

### EnvironmentBindingKinds

Ƭ **EnvironmentBindingKinds**: [`WorkerEnvFetchBinding`](keywork.md#workerenvfetchbinding) \| `KVNamespace` \| `DurableObjectNamespace`

Either:

- `WorkerEnvFetchBinding` A `fetch` binding, usually an asset KV or external Worker.
- `KVNamespace` A KV binding.
- `DurableObjectNamespace` A Durable Object.

#### Defined in

packages/keywork/dist/index.d.ts:126

___

### HTTPMethod

Ƭ **HTTPMethod**: ``"GET"`` \| ``"POST"`` \| ``"PUT"`` \| ``"PATCH"`` \| ``"DELETE"`` \| ``"HEAD"`` \| ``"OPTIONS"``

#### Defined in

packages/keywork/dist/index.d.ts:246

___

### IncomingRequestHandler

Ƭ **IncomingRequestHandler**<`BoundAliases`, `AdditionalData`\>: (`data`: [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData.md)<`BoundAliases`\>, `additionalData?`: `AdditionalData`) => `Response` \| `Promise`<`Response`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |
| `AdditionalData` | extends {} \| ``null`` = ``null`` |

#### Type declaration

▸ (`data`, `additionalData?`): `Response` \| `Promise`<`Response`\>

An incoming request handler.

**`remarks`**
- Your implementation should always return a response.
- The optional `ForcedParams` generic type is defined at compile time, but you must supply them.
- Always attempt to handle runtime errors gracefully, and respond with `KeyworkResourceError` when necessary.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IncomingRequestData`](../interfaces/keywork.IncomingRequestData.md)<`BoundAliases`\> |
| `additionalData?` | `AdditionalData` |

##### Returns

`Response` \| `Promise`<`Response`\>

#### Defined in

packages/keywork/dist/index.d.ts:271

___

### ParsedPathParams

Ƭ **ParsedPathParams**<`Key`\>: { readonly [key in Key]: string \| undefined }

The parameters that were parsed from the URL path.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Key` | extends `string` = `string` |

#### Defined in

packages/keywork/dist/index.d.ts:471

___

### RequestLike

Ƭ **RequestLike**: `Pick`<`Request`, ``"url"``\>

#### Defined in

packages/keywork/dist/index.d.ts:570

___

### URLLike

Ƭ **URLLike**: `Pick`<`URL`, ``"pathname"``\>

#### Defined in

packages/keywork/dist/index.d.ts:576

___

### WorkerEnvFetchBinding

Ƭ **WorkerEnvFetchBinding**: `Object`

An environment binding within a worker that has a `fetch` method.
This usually is related to static assets uploaded to Cloudflare KV via Wrangler's Worker Sites.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fetch` | typeof `fetch` |

#### Defined in

packages/keywork/dist/index.d.ts:596

## Variables

### DEFAULT\_SESSION\_COOKIE\_KEY

• `Const` **DEFAULT\_SESSION\_COOKIE\_KEY**: ``"_keyworkSessionID"``

**`file`** This file is part of the Keywork project.

**`copyright`** Nirrius, LLC. All rights reserved.

**`author`** Teffen Ellis, et al.

**`license`** AGPL-3.0

**`remarks`** Keywork is free software for non-commercial purposes.
You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

**`see`** LICENSE.md in the project root for further licensing information.

#### Defined in

packages/keywork/dist/index.d.ts:100

## Functions

### arrayBufferToBase64

▸ **arrayBufferToBase64**(`arrayBuffer`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arrayBuffer` | `ArrayBuffer` |

#### Returns

`string`

#### Defined in

packages/keywork/dist/index.d.ts:6

___

### convertJSONToETaggableString

▸ **convertJSONToETaggableString**(`value`): `string`

Wraps `JSON.stringify` to ensure that JSON pretty printing doesn't influence ETag generation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Object` |

#### Returns

`string`

#### Defined in

packages/keywork/dist/index.d.ts:83

___

### createCacheControlHeader

▸ **createCacheControlHeader**(`options`): [`CacheControlHeader`](keywork.md#cachecontrolheader)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| `Partial`<[`CacheControlDirectives`](../interfaces/keywork.CacheControlDirectives.md)\> |

#### Returns

[`CacheControlHeader`](keywork.md#cachecontrolheader)

#### Defined in

packages/keywork/dist/index.d.ts:85

___

### fileExtensionToContentTypeHeader

▸ **fileExtensionToContentTypeHeader**(`extension`, `mimeTypeFallback?`): [`ContentTypeHeader`](keywork.md#contenttypeheader)

Transforms a given file extension into a `ContentTypeHeader`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extension` | `string` | File extension, preferrably without the leading dot. e.g. `"txt"`, `"html"` |
| `mimeTypeFallback?` | ``"txt"`` | An optional fallback if the mimeType is not known. Defaults to `"text/plain"` |

#### Returns

[`ContentTypeHeader`](keywork.md#contenttypeheader)

#### Defined in

packages/keywork/dist/index.d.ts:195

___

### fileNameToExtension

▸ **fileNameToExtension**(`fileName`): `string`

Returns the given `fileName` extension.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileName` | `string` |

#### Returns

`string`

#### Defined in

packages/keywork/dist/index.d.ts:200

___

### generateETag

▸ **generateETag**(`entity`, `options?`): `Promise`<`string`\>

Create a simple ETag.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entity` | [`ETaggable`](keywork.md#etaggable) | Either a `string`, `ArrayBuffer`. If working with JSON, run the value through `JSON.stringify` first. |
| `options?` | [`EntityToETagOptions`](../interfaces/keywork.EntityToETagOptions.md) | See `EntityToETagOptions` |

#### Returns

`Promise`<`string`\>

#### Defined in

packages/keywork/dist/index.d.ts:210

___

### getBrowserIdentifier

▸ **getBrowserIdentifier**(`request`): `string`

**`file`** This file is part of the Keywork project.

**`copyright`** Nirrius, LLC. All rights reserved.

**`author`** Teffen Ellis, et al.

**`license`** AGPL-3.0

**`remarks`** Keywork is free software for non-commercial purposes.
You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

**`see`** LICENSE.md in the project root for further licensing information.

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request` |

#### Returns

`string`

#### Defined in

packages/keywork/dist/index.d.ts:226

___

### isETagMatch

▸ **isETagMatch**(`request`, `etag`): etag is string

Utility function to check if a given request's headers match an etag.
If the etag matches, the client may use the locally cache resource.

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request` |
| `etag` | `undefined` \| ``null`` \| `string` |

#### Returns

etag is string

#### Defined in

packages/keywork/dist/index.d.ts:284

___

### isRequestLike

▸ **isRequestLike**(`requestish`): requestish is RequestLike

#### Parameters

| Name | Type |
| :------ | :------ |
| `requestish` | `unknown` |

#### Returns

requestish is RequestLike

#### Defined in

packages/keywork/dist/index.d.ts:286

___

### isURLLike

▸ **isURLLike**(`urlish`): urlish is URLLike

#### Parameters

| Name | Type |
| :------ | :------ |
| `urlish` | `unknown` |

#### Returns

urlish is URLLike

#### Defined in

packages/keywork/dist/index.d.ts:288

___

### matchPath

▸ **matchPath**<`ExpectedParams`, `Path`\>(`pattern`, `pathname`): [`PathMatch`](../interfaces/keywork.PathMatch.md)<`ExpectedParams`\> \| ``null``

Performs pattern matching on a URL pathname and returns information about
the match.

**`see`** https://reactrouter.com/docs/en/v6/api#matchpath

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedParams` | extends ``null`` \| {} |
| `Path` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `Path` \| [`PathPattern`](../interfaces/keywork.PathPattern.md)<`Path`\> |
| `pathname` | `string` |

#### Returns

[`PathMatch`](../interfaces/keywork.PathMatch.md)<`ExpectedParams`\> \| ``null``

#### Defined in

packages/keywork/dist/index.d.ts:434

___

### parsePathname

▸ **parsePathname**<`ExpectedParams`\>(`pattern`, `urlOrRequest`): [`PathMatch`](../interfaces/keywork.PathMatch.md)<`ExpectedParams`\>

Performs pattern matching on a URL pathname and returns information about the match.

**`see`** [https://reactrouter.com/docs/en/v6/api#matchpath](https://reactrouter.com/docs/en/v6/api#matchpath)

**`throws`** {@link @keywork/utils/KeyworkResourceError}

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedParams` | extends ``null`` \| {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` \| [`PathPattern`](../interfaces/keywork.PathPattern.md)<`string`\> |
| `urlOrRequest` | `string` \| `URL` \| `Pick`<`Request`, ``"url"``\> |

#### Returns

[`PathMatch`](../interfaces/keywork.PathMatch.md)<`ExpectedParams`\>

#### Defined in

packages/keywork/dist/index.d.ts:482
