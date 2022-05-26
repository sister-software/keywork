/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import { DURATION_ONE_WEEK } from '@keywork/utils'

export type CacheControlHeader = HeadersInit & {
  'Cache-Control': string
}

export interface CacheControlOptions {
  [cacheControlKey: string]: number | boolean | string

  'max-age': number
  'must-revalidate': boolean
  immutable: boolean
}

export function createCacheControlHeader(options: Partial<CacheControlOptions> | undefined): CacheControlHeader {
  options = options || { 'max-age': DURATION_ONE_WEEK, 'must-revalidate': true }

  const headerValues: string[] = []

  for (const [key, value] of Object.entries(options)) {
    if (typeof value === 'boolean') {
      if (!value) continue

      headerValues.push(key)
    }

    headerValues.push(`${key}=${value}`)
  }

  return {
    'Cache-Control': headerValues.join(', '),
  }
}
