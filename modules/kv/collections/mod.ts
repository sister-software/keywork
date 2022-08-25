/**
 * The missing piece that unlocks the full power of storing and querying data from your Worker.
 * Keywork Collections are a NoSQL, _eventually-consistent_ ODM for
 * Cloudflare's [Worker KV](https://developers.cloudflare.com/workers/runtime-apis/kv/).
 * With an API reminiscent of Firebase and MongoDB, Keywork Collections
 * are perfect for migrating your existing backend to Cloudflare's network.
 *
 * The `KeyworkCollection` class extends the Worker KV API without abstracting away important details.
 *
 * ## Using Keywork collections from within a Cloudflare Worker.
 *
 * ```toml title="wrangler.toml"
 * compatibility_date = "2022-02-13"
 * name = "example-app"
 * route = "https://example.com/api/users/*"
 *
 * kv_namespaces = [
 *   { binding = "users", id = "abcd123...", preview_id = "efgh456..."},
 * ]
 * ```
 *
 * ## Creating a advanced request handler with a Keywork Collection.
 *
 * ```ts title=/workers/users.ts
 * import { StatusCodes } from 'http-status-codes'
 * import { KeyworkCollection } from '@keywork/collections'
 * import { KeyworkResourceError } from 'keywork/errors'
 * import { KeyworkRequestHandler, parsePathname } from 'keywork'
 *
 * interface ExampleAppBindings {
 *   exampleApp: KVNamespace
 * }
 *
 * interface GetUserParams {
 *   userID: string
 * }
 *
 * interface ExampleUser {
 *   firstName: string
 *   lastName: string
 *   role: 'member' | 'admin'
 *   plan: 'free' | 'paid'
 * }
 *
 * class UserAPIHandler extends KeyworkRequestHandler<ExampleAppBindings> {
 *   async onRequestGet({ request, env }: IncomingRequestData<ExampleAppBindings>) {
 *     const { params } = parsePathname<GetUserParams>('/users/:userID', request)
 *     const usersCollection = new KeyworkCollection<ExampleUser>(env.exampleApp, 'users')
 *     const userRef = usersCollection.createDocumentReference(params.userID)
 *     const userSnapshot = await userRef.fetchSnapshot()
 *
 *     if (!userSnapshot.exists) {
 *       throw new KeyworkResourceError('User does not exist', StatusCodes.BAD_REQUEST)
 *     }
 *
 *     const user = userSnapshot.value
 *
 *     if (user.plan !== 'paid') {
 *       throw new KeyworkResourceError('You must have a paid plan', StatusCodes.PAYMENT_REQUIRED)
 *     }
 *
 *     if (user.role !== 'admin') {
 *       throw new KeyworkResourceError('Only an admin can access this page', StatusCodes.FORBIDDEN)
 *     }
 *   }
 * }
 *
 * export default UserAPIHandler
 * ```
 *
 * @packageDocumentation
 * @module Keywork#KV#Collections
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

export * from './KeyworkCollection.ts'
export * from './KeyworkCollection/common.ts'
export * from './KeyworkDatabase.ts'
export * from './KeyworkDocumentMetadata.ts'
export * from './KeyworkDocumentReference.ts'
export * from './KeyworkDocumentSnapshot.ts'
