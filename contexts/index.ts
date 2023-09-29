/**
 * Keywork includes React contexts that are useful for server-side rendering.
 * These contexts are used to provide hook data to your application, such as the
 * current request, the current location, and the current environment.
 *
 * Much of the data provided by these contexts is already available to your app within
 * your router's callback function, but you can also use these contexts to
 * access the data within your components in a more React-like way.
 *
 * :::tip
 *
 * Generally, you won't need to add these contexts to your application, as
 * Keywork will automatically add them for you.
 *
 * :::
 *
 * ## `EnvironmentContext`
 *
 * The `EnvironmentContext` provides the current request's `env` object to your application.
 * This is useful when interacting with bindings attached to your Cloudflare Worker,
 * or when you need to access environment variables from Node.js.
 *
 * ## `URLMatchContext`
 *
 * The `URLMatchContext` provides the current request's `match` object to your application.
 * This is useful when you need to access a porition of request's URL, such as a slug,
 * or a query parameter.
 *
 * ### `useParams`
 *
 * A a convenience hook that returns the route parameters from the current request:
 *
 * ```tsx
 * import { useParams } from 'keywork/hooks'
 *
 * interface PageParams {
 *   foo: string
 * }
 *
 * const MyComponent: React.FC = () => {
 *  const params = useParams<PageParams>()
 *
 * return (
 *   <div>
 *     <h1>My Component</h1>
 *     <p>My slug is: {params.foo}</p>
 *   </div>
 * )
 *```
 *
 * @packageDocumentation
 * @module Keywork#Contexts
 *
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */
/* eslint-disable header/header */

export * from 'keywork/contexts/DocumentHeaderProvider'
export * from 'keywork/contexts/EnvironmentContext'
export * from 'keywork/contexts/FetchEventProvider'
export * from 'keywork/contexts/LocationContext'
export * from 'keywork/contexts/LoggerContext'
export * from 'keywork/contexts/RequestContext'
export * from 'keywork/contexts/StaticPropsContext'
export * from 'keywork/contexts/URLMatchContext'
