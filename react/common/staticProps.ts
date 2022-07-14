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

import { IncomingRequestEvent } from 'keywork/routing'
import { SSRPropsLike } from './constants.ts'

/**
 * A method used to fetch static props for rendering React apps in your worker.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam StaticProps Optional static props returned by `getStaticProps`
 * @typeParam Data Optional extra data to be passed to a route handler.
 */
export type GetStaticProps<
  BoundAliases extends {} | null = null,
  StaticProps extends SSRPropsLike = {},
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: IncomingRequestEvent<BoundAliases, any, Data>) => Promise<StaticProps> | StaticProps
