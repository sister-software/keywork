/**
 * Keywork uses JavaScript's built-in [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) to create pattern matchers.
 * The syntax is based on [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
 * Wildcards, named capture groups, regular groups, and group modifiers are all supported.
 *
 * ## Usage
 *
 * URL patterns can be matched against full URLs, or individual URL components:
 *
 * ### Matching URL pathname pattern.
 *
 * ```ts
 * const pattern = new URLPattern({ pathname: '/users/:user' })
 * const match = pattern.exec('/users/jessie')
 *
 * console.log(match.pathname.groups.user) // jessie
 * ```
 *
 * ### Matching a full URL pattern.
 *
 * ```ts
 * const pattern = new URLPattern('https://example.com/books/:id')
 * console.log(pattern.test('https://example.com/books/123')) // true
 * console.log(pattern.test('https://keywork.app/books/123')) // false
 * ```
 *
 * ### Matching URL pathname pattern with a base URL
 *
 * ```ts
 * const pattern = new URLPattern('/:article', 'https://blog.example.com')
 *
 * console.log(pattern.test('https://blog.example.com/article')) // true
 * console.log(pattern.test('https://blog.example.com/article/123')) // false
 * ```
 *
 * ## Peer Dependencies
 *
 * Support for the URL Pattern API varies across [browser runtimes](https://caniuse.com/mdn-api_urlpattern).
 * You may need a polyfill if your app uses a runtime that hasn't yet added [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) class.
 *
 * <Tabs groupId="node-install">
 *   <TabItem value="yarn" label="Yarn">
 *
 * ```shell title="Run in the root of your project."
 * $ yarn add urlpattern-polyfill
 * ```
 *
 *   </TabItem>
 *
 *   <TabItem value="npm" label="NPM">
 *
 * ```shell title="Run in the root of your project."
 * $ npm install --save urlpattern-polyfill
 * ```
 *
 *   </TabItem>
 * </Tabs>
 *
 * ## Related Entries
 *
 * - [Router Module](https://keywork.app/modules/router)
 *
 * ## External Resources
 * - [URL Pattern API via MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
 *
 * @packageDocumentation
 * @module Keywork#URIUtils
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

export * from './paths.ts'
export * from './URLPattern.ts'
