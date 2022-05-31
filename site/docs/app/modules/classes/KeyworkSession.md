# Class: KeyworkSession

A simple session manager to aid in authenticating users.
This is under active development.

## Table of contents

### Constructors

- [constructor](KeyworkSession.md#constructor)

### Properties

- [cookieKey](KeyworkSession.md#cookiekey)
- [isNewSession](KeyworkSession.md#isnewsession)
- [sessionID](KeyworkSession.md#sessionid)

### Methods

- [assignSessionHeaders](KeyworkSession.md#assignsessionheaders)
- [createClientID](KeyworkSession.md#createclientid)

## Constructors

### constructor

• **new KeyworkSession**(`request`, `cookieKey?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `request` | `Request` | `undefined` |
| `cookieKey` | `string` | `DEFAULT_SESSION_COOKIE_KEY` |

#### Defined in

[src/KeyworkSession.ts:29](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/KeyworkSession.ts#L29)

## Properties

### cookieKey

• **cookieKey**: `string` = `DEFAULT_SESSION_COOKIE_KEY`

___

### isNewSession

• `Readonly` **isNewSession**: `boolean`

#### Defined in

[src/KeyworkSession.ts:27](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/KeyworkSession.ts#L27)

___

### sessionID

• **sessionID**: `string`

#### Defined in

[src/KeyworkSession.ts:26](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/KeyworkSession.ts#L26)

## Methods

### assignSessionHeaders

▸ **assignSessionHeaders**(`headers`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `headers` | `Headers` |

#### Returns

`void`

#### Defined in

[src/KeyworkSession.ts:42](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/KeyworkSession.ts#L42)

___

### createClientID

▸ `Private` **createClientID**(): `string`

#### Returns

`string`

#### Defined in

[src/KeyworkSession.ts:54](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/KeyworkSession.ts#L54)
