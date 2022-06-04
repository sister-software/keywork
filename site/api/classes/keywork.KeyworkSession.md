# Class: KeyworkSession

[keywork](../modules/keywork.md).KeyworkSession

A simple session manager to aid in authenticating users.
This is under active development.

## Table of contents

### Constructors

- [constructor](keywork.KeyworkSession.md#constructor)

### Properties

- [cookieKey](keywork.KeyworkSession.md#cookiekey)
- [createClientID](keywork.KeyworkSession.md#createclientid)
- [isNewSession](keywork.KeyworkSession.md#isnewsession)
- [sessionID](keywork.KeyworkSession.md#sessionid)

### Methods

- [assignSessionHeaders](keywork.KeyworkSession.md#assignsessionheaders)

## Constructors

### constructor

• **new KeyworkSession**(`request`, `cookieKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request` |
| `cookieKey?` | `string` |

#### Defined in

packages/keywork/dist/index.d.ts:423

## Properties

### cookieKey

• **cookieKey**: `string`

#### Defined in

packages/keywork/dist/index.d.ts:420

___

### createClientID

• `Private` **createClientID**: `any`

#### Defined in

packages/keywork/dist/index.d.ts:425

___

### isNewSession

• `Readonly` **isNewSession**: `boolean`

#### Defined in

packages/keywork/dist/index.d.ts:422

___

### sessionID

• **sessionID**: `string`

#### Defined in

packages/keywork/dist/index.d.ts:421

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

packages/keywork/dist/index.d.ts:424
