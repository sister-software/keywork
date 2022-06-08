---
title: "Class: KeyworkSession"
sidebar_label: "KeyworkSession"
sidebar_class_name: "doc-kind-class"
---

# Class: KeyworkSession

[keywork](../modules/keywork).KeyworkSession

A simple session manager to aid in authenticating users.

**`beta`** This is under active development.

## Constructors

### constructor

• **new KeyworkSession**(`request`, `cookieKey?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `request` | `Request` | `undefined` |
| `cookieKey` | `string` | `DEFAULT_SESSION_COOKIE_KEY` |

#### Defined in

[packages/keywork/lib/sessions/KeyworkSession.ts:31](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/sessions/KeyworkSession.ts#L31)

## Properties

### cookieKey

• **cookieKey**: `string` = `DEFAULT_SESSION_COOKIE_KEY`

___

### isNewSession

• `Readonly` **isNewSession**: `boolean`

#### Defined in

[packages/keywork/lib/sessions/KeyworkSession.ts:29](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/sessions/KeyworkSession.ts#L29)

___

### sessionID

• **sessionID**: `string`

#### Defined in

[packages/keywork/lib/sessions/KeyworkSession.ts:28](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/sessions/KeyworkSession.ts#L28)

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

[packages/keywork/lib/sessions/KeyworkSession.ts:44](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/sessions/KeyworkSession.ts#L44)

___

### createClientID

▸ `Private` **createClientID**(): `string`

#### Returns

`string`

#### Defined in

[packages/keywork/lib/sessions/KeyworkSession.ts:56](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/sessions/KeyworkSession.ts#L56)
