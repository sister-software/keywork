# Keywork

Everything you need to handle incoming request in a Worker environment.

## Table of contents

### HTTP Responses Classes

- [CachableResponse](classes/CachableResponse.md)
- [ErrorResponse](classes/ErrorResponse.md)
- [HTMLResponse](classes/HTMLResponse.md)
- [JSONResponse](classes/JSONResponse.md)
- [NotModifiedResponse](classes/NotModifiedResponse.md)

### Incoming Request Handlers Classes

- [KeyworkRequestHandler](classes/KeyworkRequestHandler.md)
- [RedirectHandler](classes/RedirectHandler.md)

### Sessions &amp; Cookies Classes

- [KeyworkSession](classes/KeyworkSession.md)

### {Static Asset Management} Classes

- [KeyworkAssetHandler](classes/KeyworkAssetHandler.md)

### HTTP Responses Interfaces

- [CacheControlDirectives](interfaces/CacheControlDirectives.md)

### Other Interfaces

- [EntityToETagOptions](interfaces/EntityToETagOptions.md)
- [IncomingRequestData](interfaces/IncomingRequestData.md)
- [PathMatch](interfaces/PathMatch.md)
- [PathPattern](interfaces/PathPattern.md)
- [RequestWithCFProperties](interfaces/RequestWithCFProperties.md)
- [WorkersPagesAssetsBinding](interfaces/WorkersPagesAssetsBinding.md)
- [WorkersSiteStaticContentBinding](interfaces/WorkersSiteStaticContentBinding.md)

### Type Aliases

- [CacheControlHeader](modules.md#cachecontrolheader)
- [ContentTypeHeader](modules.md#contenttypeheader)
- [DefaultWorkerBindings](modules.md#defaultworkerbindings)
- [ETaggable](modules.md#etaggable)
- [EnvironmentBindingKinds](modules.md#environmentbindingkinds)
- [HTTPMethod](modules.md#httpmethod)
- [IncomingRequestHandler](modules.md#incomingrequesthandler)
- [ParsedPathParams](modules.md#parsedpathparams)
- [RequestLike](modules.md#requestlike)
- [URLLike](modules.md#urllike)
- [WorkerEnvFetchBinding](modules.md#workerenvfetchbinding)

### Variables

- [DEFAULT\_SESSION\_COOKIE\_KEY](modules.md#default_session_cookie_key)

### Functions

- [arrayBufferToBase64](modules.md#arraybuffertobase64)
- [convertJSONToETaggableString](modules.md#convertjsontoetaggablestring)
- [createCacheControlHeader](modules.md#createcachecontrolheader)
- [fileExtensionToContentTypeHeader](modules.md#fileextensiontocontenttypeheader)
- [fileNameToExtension](modules.md#filenametoextension)
- [generateETag](modules.md#generateetag)
- [getBrowserIdentifier](modules.md#getbrowseridentifier)
- [isETagMatch](modules.md#isetagmatch)
- [isRequestLike](modules.md#isrequestlike)
- [isURLLike](modules.md#isurllike)
- [matchPath](modules.md#matchpath)
- [parsePathname](modules.md#parsepathname)

## Type Aliases

### CacheControlHeader

Ƭ **CacheControlHeader**: `HeadersInit` & { `Cache-Control`: `string`  }

#### Defined in

[src/headers/cacheControl.ts:17](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/headers/cacheControl.ts#L17)

___

### ContentTypeHeader

Ƭ **ContentTypeHeader**: `HeadersInit` & { `Content-Type`: `string`  }

#### Defined in

[src/headers/contentType.ts:19](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/headers/contentType.ts#L19)

___

### DefaultWorkerBindings

Ƭ **DefaultWorkerBindings**: [`WorkersSiteStaticContentBinding`](interfaces/WorkersSiteStaticContentBinding.md) \| [`WorkersPagesAssetsBinding`](interfaces/WorkersPagesAssetsBinding.md)

#### Defined in

[src/bindings/environment.ts:27](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/environment.ts#L27)

___

### ETaggable

Ƭ **ETaggable**: `string` \| `ArrayBuffer`

Types that can be converted into ETags.

#### Defined in

[src/etags/common.ts:25](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/etags/common.ts#L25)

___

### EnvironmentBindingKinds

Ƭ **EnvironmentBindingKinds**: [`WorkerEnvFetchBinding`](modules.md#workerenvfetchbinding) \| `KVNamespace` \| `DurableObjectNamespace`

Either:

- `WorkerEnvFetchBinding` A `fetch` binding, usually an asset KV or external Worker.
- `KVNamespace` A KV binding.
- `DurableObjectNamespace` A Durable Object.

#### Defined in

[src/bindings/environment.ts:25](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/environment.ts#L25)

___

### HTTPMethod

Ƭ **HTTPMethod**: ``"GET"`` \| ``"POST"`` \| ``"PUT"`` \| ``"PATCH"`` \| ``"DELETE"`` \| ``"HEAD"`` \| ``"OPTIONS"``

#### Defined in

[src/requests/common.ts:18](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/common.ts#L18)

___

### IncomingRequestHandler

Ƭ **IncomingRequestHandler**<`BoundAliases`, `AdditionalData`\>: (`data`: [`IncomingRequestData`](interfaces/IncomingRequestData.md)<`BoundAliases`\>, `additionalData?`: `AdditionalData`) => `Response` \| `Promise`<`Response`\>

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
| `data` | [`IncomingRequestData`](interfaces/IncomingRequestData.md)<`BoundAliases`\> |
| `additionalData?` | `AdditionalData` |

##### Returns

`Response` \| `Promise`<`Response`\>

#### Defined in

[src/requests/common.ts:48](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/requests/common.ts#L48)

___

### ParsedPathParams

Ƭ **ParsedPathParams**<`Key`\>: { readonly [key in Key]: string \| undefined }

The parameters that were parsed from the URL path.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Key` | extends `string` = `string` |

#### Defined in

[src/paths/common.ts:122](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L122)

___

### RequestLike

Ƭ **RequestLike**: `Pick`<`Request`, ``"url"``\>

#### Defined in

[src/paths/common.ts:126](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L126)

___

### URLLike

Ƭ **URLLike**: `Pick`<`URL`, ``"pathname"``\>

#### Defined in

[src/paths/common.ts:127](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L127)

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

[src/bindings/fetch.ts:19](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/fetch.ts#L19)

## Variables

### DEFAULT\_SESSION\_COOKIE\_KEY

• `Const` **DEFAULT\_SESSION\_COOKIE\_KEY**: ``"_keyworkSessionID"``

#### Defined in

[src/KeyworkSession.ts:18](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/KeyworkSession.ts#L18)

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

[src/etags/generateETag.ts:70](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/etags/generateETag.ts#L70)

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

[src/etags/common.ts:18](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/etags/common.ts#L18)

___

### createCacheControlHeader

▸ **createCacheControlHeader**(`options`): [`CacheControlHeader`](modules.md#cachecontrolheader)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| `Partial`<[`CacheControlDirectives`](interfaces/CacheControlDirectives.md)\> |

#### Returns

[`CacheControlHeader`](modules.md#cachecontrolheader)

#### Defined in

[src/headers/cacheControl.ts:34](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/headers/cacheControl.ts#L34)

___

### fileExtensionToContentTypeHeader

▸ **fileExtensionToContentTypeHeader**(`extension`, `mimeTypeFallback?`): [`ContentTypeHeader`](modules.md#contenttypeheader)

Transforms a given file extension into a `ContentTypeHeader`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `extension` | `string` | `undefined` | File extension, preferrably without the leading dot. e.g. `"txt"`, `"html"` |
| `mimeTypeFallback` | ``"txt"`` | `PlainText.extension` | An optional fallback if the mimeType is not known. Defaults to `"text/plain"` |

#### Returns

[`ContentTypeHeader`](modules.md#contenttypeheader)

#### Defined in

[src/headers/contentType.ts:29](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/headers/contentType.ts#L29)

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

[src/files/files.ts:18](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/files/files.ts#L18)

___

### generateETag

▸ **generateETag**(`entity`, `options?`): `Promise`<`string`\>

Create a simple ETag.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entity` | [`ETaggable`](modules.md#etaggable) | Either a `string`, `ArrayBuffer`. If working with JSON, run the value through `JSON.stringify` first. |
| `options?` | [`EntityToETagOptions`](interfaces/EntityToETagOptions.md) | See `EntityToETagOptions` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/etags/generateETag.ts:40](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/etags/generateETag.ts#L40)

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

[src/headers/userAgent.ts:15](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/headers/userAgent.ts#L15)

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

[src/etags/common.ts:37](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/etags/common.ts#L37)

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

[src/paths/common.ts:129](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L129)

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

[src/paths/common.ts:133](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L133)

___

### matchPath

▸ **matchPath**<`ExpectedParams`, `Path`\>(`pattern`, `pathname`): [`PathMatch`](interfaces/PathMatch.md)<`ExpectedParams`\> \| ``null``

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
| `pattern` | `Path` \| [`PathPattern`](interfaces/PathPattern.md)<`Path`\> |
| `pathname` | `string` |

#### Returns

[`PathMatch`](interfaces/PathMatch.md)<`ExpectedParams`\> \| ``null``

#### Defined in

[src/paths/matchPath.ts:23](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/matchPath.ts#L23)

___

### parsePathname

▸ **parsePathname**<`ExpectedParams`\>(`pattern`, `urlOrRequest`): [`PathMatch`](interfaces/PathMatch.md)<`ExpectedParams`\>

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
| `pattern` | `string` \| [`PathPattern`](interfaces/PathPattern.md)<`string`\> |
| `urlOrRequest` | `string` \| `URL` \| `Pick`<`Request`, ``"url"``\> |

#### Returns

[`PathMatch`](interfaces/PathMatch.md)<`ExpectedParams`\>

#### Defined in

[src/paths/parsePathname.ts:28](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/parsePathname.ts#L28)
