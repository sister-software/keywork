/**
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

/**
 * ### `@keywork/utils`
 *
 * ![npm (scoped)](https://img.shields.io/npm/v/@keywork/utils)
 * ![npm](https://img.shields.io/npm/dm/@keywork/utils)
 *
 * Common core utilities for building web apps.
 *
 * - HTTP responses for content like JSON, HTML, and much more!
 * - Type-safe request handlers that make API endpoints easy.
 * - Cache headers, cache responses, and even ETag generation for your own content.
 * - Simplified error handling for your server-side Worker logic.
 * - URL helpers, path builders.
 * - ULID and Snowflake ID generation.
 * - Isomorpic runtime error handling for both the browser, and your Worker.
 * - Logging that helps you better trace down errors as your app grows.
 * - All the typical "junk drawer" stuff you usually have to implement when building a web app.
 *
 * @packageDocumentation
 * @module
 */

export * from './lib/common/index.js'
export * from './lib/errors/index.js'
export * from './lib/etags/index.js'
export * from './lib/headers/index.js'
export * from './lib/ids/index.js'
export * from './lib/paths/index.js'
export * from './lib/polyfills/index.js'
export * from './lib/responses/index.js'
