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

import { KeyworkResourceError } from 'keywork/errors'
import { polyfillWithModule, readGlobalScope } from 'keywork/utils'

type URLPatternModule = {
  URLPattern: IURLPattern
}

/**
 * @internal
 */
export function polyfillURLPattern() {
  return polyfillWithModule<URLPatternModule>('urlpattern-polyfill', ['URLPattern'])
}

export interface IURLPattern {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (init?: URLPatternInput, baseURL?: string): IURLPattern

  test(input?: URLPatternInput, baseURL?: string): boolean

  exec(input?: URLPatternInput, baseURL?: string): URLPatternResult | null

  readonly protocol: string
  readonly username: string
  readonly password: string
  readonly hostname: string
  readonly port: string
  readonly pathname: string
  readonly search: string
  readonly hash: string
}

interface URLPatternInit {
  baseURL?: string
  username?: string
  password?: string
  protocol?: string
  hostname?: string
  port?: string
  pathname?: string
  search?: string
  hash?: string
}

export interface URLPathnameInput {
  pathname: string
}

export interface URLPatternResult {
  inputs: [URLPatternInput]
  protocol: URLPatternComponentResult
  username: URLPatternComponentResult
  password: URLPatternComponentResult
  hostname: URLPatternComponentResult
  port: URLPatternComponentResult
  pathname: URLPatternComponentResult
  search: URLPatternComponentResult
  hash: URLPatternComponentResult
}

export interface URLPatternComponentResult {
  input: string
  groups: {
    [key: string]: string | undefined
  }
}

interface WithURLPatternConstructor {
  URLPattern: IURLPattern
}

function globalScopeHasURLPattern(
  windowOrGlobal: any = readGlobalScope()
): windowOrGlobal is WithURLPatternConstructor {
  return windowOrGlobal && 'URLPattern' in windowOrGlobal
}

/**
 * Either an instance of `URLPattern`,
 * or a string representing the `pathname` portion of a `URLPattern`
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern URLPattern Constructor via MDN}
 */
export type URLPatternLike = IURLPattern | URLPatternInit | string | URL

interface NormalizeURLPatternOptions {
  /**
   * Append a wildcard matcher to the `pathname` pattern.
   * This is applicable if the pattern is used to mount middleware.
   */
  appendWildcard: boolean
}

/**
 * Converts a given `URLPatternLike` to `URLPattern`
 *
 * @category Type Cast
 */
export function normalizeURLPattern(patternLike: URLPatternLike, options?: NormalizeURLPatternOptions): IURLPattern {
  const input: URLPatternInit =
    typeof patternLike === 'string'
      ? {
          pathname: patternLike,
        }
      : patternLike
  // Note that a given input may be readonly, so we make a mutable copy.
  let { pathname = '*' } = input

  if (options?.appendWildcard && !pathname.endsWith('*')) {
    pathname += '*'
  }

  const globalLike = readGlobalScope()

  if (!globalScopeHasURLPattern(globalLike)) {
    throw new KeyworkResourceError(
      '`URLPattern` does not appear to be available in this environment. Consider using a polyfill.'
    )
  }

  const urlPattern = new globalLike.URLPattern({
    ...input,
    pathname,
  })

  return urlPattern
}

/**
 * Converts a given `URLPatternInit` to `URLPatternInit`
 *
 * @category Type Cast
 */
export function normalizeURLPatternInit(input: URLPatternInit | string): URLPatternInit {
  return typeof input === 'string' ? { pathname: input } : input
}

export type URLPatternInput = URLPatternInit | string
