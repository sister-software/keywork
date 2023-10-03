/**
 * Keywork includes utilities for working with incoming HTTP requests,
 * and extends the native [`Request` class](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * for use with [Cloudflare Workers](https://developers.cloudflare.com/workers/runtime-apis/request/#requestinitcfproperties)
 *
 * See each of HTTP's submodules for additional details.
 *
 * @packageDocumentation
 * @module Keywork#HTTP
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

export * from 'keywork/http/headers'
export * from 'keywork/http/responses'

export * from './HTTPMethod.js'
export * from './IncomingRequestCfProperties.js'
export * from './RequestContext.js'
export * from './RouterMethod.js'
export * from './accepts.js'
export * from './castToResponse.js'
export * from './cloneAsMutableResponse.js'
export * from './cors.js'
export * from './isCompressable.js'
export * from './isInstanceOfRequest.js'
export * from './isInstanceOfResponse.js'
export * from './isRequestLike.js'
export * from './methodVerbToRouterMethod.js'
export * from './routerMethodToHTTPMethod.js'
export * from './shouldCompress.js'
