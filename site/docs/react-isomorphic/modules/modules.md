# Keywork

## Table of contents

### Classes

- [KeyworkStaticPropsRequestHandler](classes/KeyworkStaticPropsRequestHandler.md)
- [PatternToPageComponentMap](classes/PatternToPageComponentMap.md)

### Interfaces

- [GlobalScopeWithKeyworkSSRProps](interfaces/GlobalScopeWithKeyworkSSRProps.md)
- [HydrateKeyworkAppOptions](interfaces/HydrateKeyworkAppOptions.md)
- [KeyworkBrowserRouterProps](interfaces/KeyworkBrowserRouterProps.md)
- [KeyworkHTMLDocumentProps](interfaces/KeyworkHTMLDocumentProps.md)
- [KeyworkRouterProps](interfaces/KeyworkRouterProps.md)
- [KeyworkRouterProvider](interfaces/KeyworkRouterProvider.md)
- [ProviderWrapperProps](interfaces/ProviderWrapperProps.md)
- [SSRProviderProps](interfaces/SSRProviderProps.md)
- [StaticPropsProvider](interfaces/StaticPropsProvider.md)

### Type Aliases

- [GetStaticPropsHandler](modules.md#getstaticpropshandler)
- [GlobalScopeSSRKey](modules.md#globalscopessrkey)
- [KeyworkHTMLDocumentComponent](modules.md#keyworkhtmldocumentcomponent)
- [KeyworkProvidersComponent](modules.md#keyworkproviderscomponent)
- [SSRPropsLike](modules.md#ssrpropslike)
- [StaticPropsProviderComponent](modules.md#staticpropsprovidercomponent)

### Variables

- [KeyworkHTMLDocument](modules.md#keyworkhtmldocument)
- [KeyworkPatternToPageComponent](modules.md#keyworkpatterntopagecomponent)
- [KeyworkProviders](modules.md#keyworkproviders)
- [KeyworkRouter](modules.md#keyworkrouter)
- [StaticPropsProvider](modules.md#staticpropsprovider)
- [globalScopeSSRKey](modules.md#globalscopessrkey-1)

### Functions

- [createContextAndNamedHook](modules.md#createcontextandnamedhook)
- [getSSRPropsFromScope](modules.md#getssrpropsfromscope)
- [globalScopeHasSSRProps](modules.md#globalscopehasssrprops)
- [hydrateKeyworkApp](modules.md#hydratekeyworkapp)
- [matchRoute](modules.md#matchroute)
- [useKeyworkRouter](modules.md#usekeyworkrouter)
- [useMatch](modules.md#usematch)
- [useStaticProps](modules.md#usestaticprops)

## Type Aliases

### GetStaticPropsHandler

Ƭ **GetStaticPropsHandler**<`StaticProps`, `BoundAliases`, `AdditionalData`\>: (`data`: `IncomingRequestData`<`BoundAliases`\>, `additionalData?`: `AdditionalData`) => `StaticProps` \| `Promise`<`StaticProps`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StaticProps` | extends {} \| ``null`` |
| `BoundAliases` | extends {} \| ``null`` = ``null`` |
| `AdditionalData` | extends {} \| ``null`` = ``null`` |

#### Type declaration

▸ (`data`, `additionalData?`): `StaticProps` \| `Promise`<`StaticProps`\>

A request handler that fetches static props for a server-side rendered React component.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `IncomingRequestData`<`BoundAliases`\> |
| `additionalData?` | `AdditionalData` |

##### Returns

`StaticProps` \| `Promise`<`StaticProps`\>

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:35](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/props.ts#L35)

___

### GlobalScopeSSRKey

Ƭ **GlobalScopeSSRKey**: typeof [`globalScopeSSRKey`](modules.md#globalscopessrkey-1)

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:25](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/props.ts#L25)

___

### KeyworkHTMLDocumentComponent

Ƭ **KeyworkHTMLDocumentComponent**: `FC`<[`KeyworkHTMLDocumentProps`](interfaces/KeyworkHTMLDocumentProps.md)\>

#### Defined in

[packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx:40](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx#L40)

___

### KeyworkProvidersComponent

Ƭ **KeyworkProvidersComponent**: `FC`<[`ProviderWrapperProps`](interfaces/ProviderWrapperProps.md)\>

A component which wraps the current SSR routes.
Use this if you need to inject a provider into the SSR pipeline.

#### Defined in

[packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx:25](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx#L25)

___

### SSRPropsLike

Ƭ **SSRPropsLike**: {} \| ``null``

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:18](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/props.ts#L18)

___

### StaticPropsProviderComponent

Ƭ **StaticPropsProviderComponent**<`StaticProps`\>: `FC`<[`StaticPropsProvider`](modules.md#staticpropsprovider)<`StaticProps`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StaticProps` | extends `NonNullable`<[`SSRPropsLike`](modules.md#ssrpropslike)\> = `NonNullable`<[`SSRPropsLike`](modules.md#ssrpropslike)\> |

#### Defined in

[packages/react-isomorphic/src/components/StaticPropsProvider.tsx:27](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/StaticPropsProvider.tsx#L27)

## Variables

### KeyworkHTMLDocument

• `Const` **KeyworkHTMLDocument**: [`KeyworkHTMLDocumentComponent`](modules.md#keyworkhtmldocumentcomponent)

A server-side render of a given HTML document.

#### Defined in

[packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx:46](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx#L46)

___

### KeyworkPatternToPageComponent

• `Const` **KeyworkPatternToPageComponent**: `FC`<[`KeyworkBrowserRouterProps`](interfaces/KeyworkBrowserRouterProps.md)\>

#### Defined in

[packages/react-isomorphic/src/components/KeyworkPatternToPageComponent.tsx:31](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/KeyworkPatternToPageComponent.tsx#L31)

___

### KeyworkProviders

• `Const` **KeyworkProviders**: [`KeyworkProvidersComponent`](modules.md#keyworkproviderscomponent)

#### Defined in

[packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx:27](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx#L27)

___

### KeyworkRouter

• `Const` **KeyworkRouter**: `FC`<[`KeyworkRouterProps`](interfaces/KeyworkRouterProps.md)\>

#### Defined in

[packages/react-isomorphic/src/components/KeyworkRouter.tsx:33](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/KeyworkRouter.tsx#L33)

___

### StaticPropsProvider

• **StaticPropsProvider**: [`StaticPropsProviderComponent`](modules.md#staticpropsprovidercomponent)<{}\>

#### Defined in

[packages/react-isomorphic/src/components/StaticPropsProvider.tsx:30](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/components/StaticPropsProvider.tsx#L30)

___

### globalScopeSSRKey

• `Const` **globalScopeSSRKey**: ``"__ keywork_ssr_props"``

The global key where SSR props are assigned.

**`remarks`** This includes a space to prevent autocomplete from listing this key.

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:24](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/props.ts#L24)

## Functions

### createContextAndNamedHook

▸ **createContextAndNamedHook**<`T`\>(`defaultValue?`, `displayName?`): readonly [`React.Context`<`T` \| `undefined`\>, <V\>() => `NonNullable`<`V`\>]

A convenience wrapper around `React.createContext` that creates a context and hook for the child components within a Provider's context.

**`example`**
Creating a named context Provider with a computed value.

```tsx title=WidgetsProvider.tsx
const [WidgetsContext, useWidgetsContext] = createNamedContextHook<WidgetsProvider>()
// Note that the `WidgetsContext` is not exported if the provider needs additional logic.
export { useWidgetsContext }

// Instead, a component is declared to pass down a computed value.
export const WidgetProvider: React.FC<WidgetProviderProps> = ({children}) => {
  // Always use a memoized value to prevent rerenders.
  // Some combination of props go here...
  const value = useMemo<WidgetsProvider>(() => ({}), [dep1, dep2, depN])

  return <WidgetsContext.Provider value={value}>{children}</WidgetsContext.Provider>
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `defaultValue` | `undefined` \| `T` | `undefined` |
| `displayName?` | `string` | `undefined` |

#### Returns

readonly [`React.Context`<`T` \| `undefined`\>, <V\>() => `NonNullable`<`V`\>]

contextTuple

#### Defined in

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:40](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L40)

___

### getSSRPropsFromScope

▸ **getSSRPropsFromScope**<`SSRProps`\>(`globalScope`): `SSRProps`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SSRProps` | extends [`SSRPropsLike`](modules.md#ssrpropslike) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `globalScope` | `unknown` | In most cases, this is either `window` or `self`. |

#### Returns

`SSRProps`

SSRProps

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:61](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/props.ts#L61)

___

### globalScopeHasSSRProps

▸ **globalScopeHasSSRProps**<`SSRProps`\>(`globalScope`): globalScope is GlobalScopeWithKeyworkSSRProps<SSRProps\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SSRProps` | extends [`SSRPropsLike`](modules.md#ssrpropslike) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `globalScope` | `unknown` |

#### Returns

globalScope is GlobalScopeWithKeyworkSSRProps<SSRProps\>

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:50](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/props.ts#L50)

___

### hydrateKeyworkApp

▸ **hydrateKeyworkApp**(`initialChildren`, `options?`): `Root`

Hydrates a server-side rendered React component.

**`remarks`** This should only run in the browser.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialChildren` | `ReactNode` | This should be the current page's component, along with any needed providers. |
| `options?` | [`HydrateKeyworkAppOptions`](interfaces/HydrateKeyworkAppOptions.md) | - |

#### Returns

`Root`

#### Defined in

[packages/react-isomorphic/src/ssr/hydration.tsx:37](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/hydration.tsx#L37)

___

### matchRoute

▸ **matchRoute**(`patternToPageComponent`, `location`): ``null`` \| `PathMatch`<``null`` \| {}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patternToPageComponent` | [`PatternToPageComponentMap`](classes/PatternToPageComponentMap.md)<`any`\> |
| `location` | `URL` |

#### Returns

``null`` \| `PathMatch`<``null`` \| {}\>

#### Defined in

[packages/react-isomorphic/src/ssr/pages.ts:48](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/ssr/pages.ts#L48)

___

### useKeyworkRouter

▸ **useKeyworkRouter**<`V`\>(): `NonNullable`<`V`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `V` | [`KeyworkRouterProvider`](interfaces/KeyworkRouterProvider.md) |

#### Returns

`NonNullable`<`V`\>

#### Defined in

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:45](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L45)

___

### useMatch

▸ **useMatch**<`V`\>(): `NonNullable`<`V`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `V` | ``null`` \| `PathMatch`<``null`` \| {}\> |

#### Returns

`NonNullable`<`V`\>

#### Defined in

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:45](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L45)

___

### useStaticProps

▸ **useStaticProps**<`V`\>(): `NonNullable`<`V`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `V` | [`SSRPropsLike`](modules.md#ssrpropslike) |

#### Returns

`NonNullable`<`V`\>

#### Defined in

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:45](https://github.com/nirrius/keywork/blob/3dc0058/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L45)
