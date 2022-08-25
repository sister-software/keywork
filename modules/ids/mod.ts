/**
 * Keywork includes utilities for generating IDs.
 *
 * ### ULIDs
 *
 * ULIDs are provided via [ULIDX](https://www.npmjs.com/package/ulidx)
 *
 * ```ts
 * import { ulid } from 'keywork/ids'
 *
 * const id = ulid()
 * ```
 *
 * ### Snowflake IDs
 *
 * Keywork's `SnowflakeID` is a basic implementation of Twitter's original [Snowflake ID system](https://en.wikipedia.org/wiki/Snowflake_ID).
 *
 * ```ts
 * import { SnowflakeID } from 'keywork/ids'
 *
 * const id = new SnowflakeID()
 * ```
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
 * @packageDocumentation
 * @module Keywork#IDUtils
 */
/* eslint-disable header/header */

// Using ULIDX for now. Let's see how this fairs...
export * from 'https://esm.sh/ulidx@0.3.0'
export * from './SnowflakeID.ts'
