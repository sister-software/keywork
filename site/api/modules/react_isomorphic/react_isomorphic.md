# Module: react-isomorphic

## Table of contents

### Classes

- [KeyworkStaticPropsRequestHandler](../classes/react_isomorphic.KeyworkStaticPropsRequestHandler.md)
- [PatternToPageComponentMap](../classes/react_isomorphic.PatternToPageComponentMap.md)

### Interfaces

- [GlobalScopeWithKeyworkSSRProps](../interfaces/react_isomorphic.GlobalScopeWithKeyworkSSRProps.md)
- [HydrateKeyworkAppOptions](../interfaces/react_isomorphic.HydrateKeyworkAppOptions.md)
- [KeyworkBrowserRouterProps](../interfaces/react_isomorphic.KeyworkBrowserRouterProps.md)
- [KeyworkHTMLDocumentProps](../interfaces/react_isomorphic.KeyworkHTMLDocumentProps.md)
- [KeyworkRouterProps](../interfaces/react_isomorphic.KeyworkRouterProps.md)
- [KeyworkRouterProvider](../interfaces/react_isomorphic.KeyworkRouterProvider.md)
- [ProviderWrapperProps](../interfaces/react_isomorphic.ProviderWrapperProps.md)
- [SSRProviderProps](../interfaces/react_isomorphic.SSRProviderProps.md)
- [StaticPropsProvider](../interfaces/react_isomorphic.StaticPropsProvider.md)

### Type Aliases

- [GetStaticPropsHandler](react_isomorphic.md#getstaticpropshandler)
- [GlobalScopeSSRKey](react_isomorphic.md#globalscopessrkey)
- [KeyworkHTMLDocumentComponent](react_isomorphic.md#keyworkhtmldocumentcomponent)
- [KeyworkProvidersComponent](react_isomorphic.md#keyworkproviderscomponent)
- [SSRPropsLike](react_isomorphic.md#ssrpropslike)
- [StaticPropsProviderComponent](react_isomorphic.md#staticpropsprovidercomponent)

### Variables

- [KeyworkHTMLDocument](react_isomorphic.md#keyworkhtmldocument)
- [KeyworkPatternToPageComponent](react_isomorphic.md#keyworkpatterntopagecomponent)
- [KeyworkProviders](react_isomorphic.md#keyworkproviders)
- [KeyworkRouter](react_isomorphic.md#keyworkrouter)
- [StaticPropsProvider](react_isomorphic.md#staticpropsprovider)
- [globalScopeSSRKey](react_isomorphic.md#globalscopessrkey-1)

### Functions

- [createContextAndNamedHook](react_isomorphic.md#createcontextandnamedhook)
- [getSSRPropsFromScope](react_isomorphic.md#getssrpropsfromscope)
- [globalScopeHasSSRProps](react_isomorphic.md#globalscopehasssrprops)
- [hydrateKeyworkApp](react_isomorphic.md#hydratekeyworkapp)
- [matchRoute](react_isomorphic.md#matchroute)
- [useKeyworkRouter](react_isomorphic.md#usekeyworkrouter)
- [useMatch](react_isomorphic.md#usematch)
- [useStaticProps](react_isomorphic.md#usestaticprops)

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

[packages/react-isomorphic/src/ssr/props.ts:35](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/props.ts#L35)

___

### GlobalScopeSSRKey

Ƭ **GlobalScopeSSRKey**: typeof [`globalScopeSSRKey`](react_isomorphic.md#globalscopessrkey-1)

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:25](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/props.ts#L25)

___

### KeyworkHTMLDocumentComponent

Ƭ **KeyworkHTMLDocumentComponent**: `FC`<[`KeyworkHTMLDocumentProps`](../interfaces/react_isomorphic.KeyworkHTMLDocumentProps.md)\>

#### Defined in

[packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx:40](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx#L40)

___

### KeyworkProvidersComponent

Ƭ **KeyworkProvidersComponent**: `FC`<[`ProviderWrapperProps`](../interfaces/react_isomorphic.ProviderWrapperProps.md)\>

A component which wraps the current SSR routes.
Use this if you need to inject a provider into the SSR pipeline.

#### Defined in

[packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx:25](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx#L25)

___

### SSRPropsLike

Ƭ **SSRPropsLike**: {} \| ``null``

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:18](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/props.ts#L18)

___

### StaticPropsProviderComponent

Ƭ **StaticPropsProviderComponent**<`StaticProps`\>: `FC`<[`StaticPropsProvider`](react_isomorphic.md#staticpropsprovider)<`StaticProps`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `StaticProps` | extends `NonNullable`<[`SSRPropsLike`](react_isomorphic.md#ssrpropslike)\> = `NonNullable`<[`SSRPropsLike`](react_isomorphic.md#ssrpropslike)\> |

#### Defined in

[packages/react-isomorphic/src/components/StaticPropsProvider.tsx:27](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/StaticPropsProvider.tsx#L27)

## Variables

### KeyworkHTMLDocument

• `Const` **KeyworkHTMLDocument**: [`KeyworkHTMLDocumentComponent`](react_isomorphic.md#keyworkhtmldocumentcomponent)

A server-side render of a given HTML document.

#### Defined in

[packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx:46](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/KeyworkHTMLDocument.tsx#L46)

___

### KeyworkPatternToPageComponent

• `Const` **KeyworkPatternToPageComponent**: `FC`<[`KeyworkBrowserRouterProps`](../interfaces/react_isomorphic.KeyworkBrowserRouterProps.md)\>

#### Defined in

[packages/react-isomorphic/src/components/KeyworkPatternToPageComponent.tsx:31](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/KeyworkPatternToPageComponent.tsx#L31)

___

### KeyworkProviders

• `Const` **KeyworkProviders**: [`KeyworkProvidersComponent`](react_isomorphic.md#keyworkproviderscomponent)

#### Defined in

[packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx:27](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/KeyworkProvidersComponent.tsx#L27)

___

### KeyworkRouter

• `Const` **KeyworkRouter**: `FC`<[`KeyworkRouterProps`](../interfaces/react_isomorphic.KeyworkRouterProps.md)\>

#### Defined in

[packages/react-isomorphic/src/components/KeyworkRouter.tsx:33](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/KeyworkRouter.tsx#L33)

___

### StaticPropsProvider

• **StaticPropsProvider**: [`StaticPropsProviderComponent`](react_isomorphic.md#staticpropsprovidercomponent)<{}\>

#### Defined in

[packages/react-isomorphic/src/components/StaticPropsProvider.tsx:30](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/components/StaticPropsProvider.tsx#L30)

___

### globalScopeSSRKey

• `Const` **globalScopeSSRKey**: ``"__ keywork_ssr_props"``

The global key where SSR props are assigned.

**`remarks`** This includes a space to prevent autocomplete from listing this key.

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:24](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/props.ts#L24)

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

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:40](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L40)

___

### getSSRPropsFromScope

▸ **getSSRPropsFromScope**<`SSRProps`\>(`globalScope`): `SSRProps`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SSRProps` | extends [`SSRPropsLike`](react_isomorphic.md#ssrpropslike) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `globalScope` | `unknown` | In most cases, this is either `window` or `self`. |

#### Returns

`SSRProps`

SSRProps

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:61](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/props.ts#L61)

___

### globalScopeHasSSRProps

▸ **globalScopeHasSSRProps**<`SSRProps`\>(`globalScope`): globalScope is GlobalScopeWithKeyworkSSRProps<SSRProps\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SSRProps` | extends [`SSRPropsLike`](react_isomorphic.md#ssrpropslike) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `globalScope` | `unknown` |

#### Returns

globalScope is GlobalScopeWithKeyworkSSRProps<SSRProps\>

#### Defined in

[packages/react-isomorphic/src/ssr/props.ts:50](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/props.ts#L50)

___

### hydrateKeyworkApp

▸ **hydrateKeyworkApp**(`initialChildren`, `options?`): `Root`

Hydrates a server-side rendered React component.

**`remarks`** This should only run in the browser.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialChildren` | `ReactNode` | This should be the current page's component, along with any needed providers. |
| `options?` | [`HydrateKeyworkAppOptions`](../interfaces/react_isomorphic.HydrateKeyworkAppOptions.md) | - |

#### Returns

`Root`

#### Defined in

[packages/react-isomorphic/src/ssr/hydration.tsx:37](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/hydration.tsx#L37)

___

### matchRoute

▸ **matchRoute**(`patternToPageComponent`, `location`): ``null`` \| `PathMatch`<``null`` \| {}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `patternToPageComponent` | [`PatternToPageComponentMap`](../classes/react_isomorphic.PatternToPageComponentMap.md)<`any`\> |
| `location` | `URL` |

#### Returns

``null`` \| `PathMatch`<``null`` \| {}\>

#### Defined in

[packages/react-isomorphic/src/ssr/pages.ts:48](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/ssr/pages.ts#L48)

___

### useKeyworkRouter

▸ **useKeyworkRouter**<`V`\>(): `NonNullable`<`V`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `V` | [`KeyworkRouterProvider`](../interfaces/react_isomorphic.KeyworkRouterProvider.md) |

#### Returns

`NonNullable`<`V`\>

#### Defined in

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:45](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L45)

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

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:45](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L45)

___

### useStaticProps

▸ **useStaticProps**<`V`\>(): `NonNullable`<`V`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `V` | [`SSRPropsLike`](react_isomorphic.md#ssrpropslike) |

#### Returns

`NonNullable`<`V`\>

#### Defined in

[packages/react-isomorphic/src/hooks/createNamedContextHook.ts:45](https://github.com/nirrius/keywork/blob/361509a/packages/react-isomorphic/src/hooks/createNamedContextHook.ts#L45)
