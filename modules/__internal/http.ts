/**
 * Keywork includes utilities for working with HTTP lifecycles.
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

import { polyfillWithModule } from './functions/polyfillWithModule.ts'

export type HTTPExports = Pick<typeof globalThis, 'Request' | 'Headers' | 'Response'>

const HTTP = await polyfillWithModule<HTTPExports>('undici', ['Request', 'Headers', 'Response'])

export default HTTP
