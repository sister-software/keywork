---
title: "Class: KeyworkSession"
sidebar_label: "KeyworkSession"
sidebar_class_name: "doc-kind-class"
---

# Class: KeyworkSession

[keywork](../modules/keywork).KeyworkSession

A simple session manager to aid in authenticating users.
This is under active development.

## Constructors

### constructor

• **new KeyworkSession**(`request`, `cookieKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request` |
| `cookieKey?` | `string` |

#### Defined in

packages/keywork/dist/index.d.ts:379

## Properties

### cookieKey

• **cookieKey**: `string`

#### Defined in

packages/keywork/dist/index.d.ts:376

___

### createClientID

• `Private` **createClientID**: `any`

#### Defined in

packages/keywork/dist/index.d.ts:381

___

### isNewSession

• `Readonly` **isNewSession**: `boolean`

#### Defined in

packages/keywork/dist/index.d.ts:378

___

### sessionID

• **sessionID**: `string`

#### Defined in

packages/keywork/dist/index.d.ts:377

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

packages/keywork/dist/index.d.ts:380
