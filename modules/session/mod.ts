/**
 * Keywork includes optional middleware to manage and authenticate your users.
 *
 * ```ts
 * import { SessionMiddleware } from 'keywork/session'
 * import { KeyworkRouter } from 'keywork/router'
 *
 * const app = new KeyworkRouter({
 *   displayName: 'Session Tester',
 *   middleware: [new SessionMiddleware()],
 * })
 *
 * app.get('/', (event) => {
 *   const { session } = event.data
 *
 *   if (session.isNewSession) {
 *     return 'Hello there, new user!'
 *   }
 *
 *   return `Hello again, ${session.sessionID}!`
 * })
 * ```
 * ## Related Entries
 *
 * - {@link Keywork#Session.SessionMiddleware `SessionMiddleware`}
 *
 * @packageDocumentation
 * @module Keywork#Session
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

export * from './common.ts'
export * from './SessionMiddleware.ts'
