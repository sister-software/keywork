/**
 * Keywork includes error utilities that pair nicely with HTTP request handlers.
 *
 * ```ts
 * import { KeyworkResourceError, StatusCodes } from 'keywork/errors'
 *
 * if (isLoggedIn(someUser)) {
 *   throw new KeyworkResourceError('You must be logged in to do that', StatusCodes.UNAUTHORIZED)
 * }
 *
 * if (someUser.role !== 'admin') {
 *   throw new KeyworkResourceError('Only an admin can access that', StatusCodes.FORBIDDEN)
 * }
 * ```
 *
 * ## Related Entries
 *
 * - {@link Keywork#HTTP#Response.ErrorResponse `ErrorResponse`}
 *
 * @packageDocumentation
 * @module Keywork#Errors
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

export * from 'keywork/errors/KeyworkResourceError'
export * from 'keywork/errors/common'
