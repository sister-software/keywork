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

import type { ComponentType } from 'react'
import { KeyworkResourceError } from '../errors/index.js'
import { readGlobalScope } from '../utils/index.js'

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

type URLPatternInit = {
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
 * A component that can be rendered by a `KeyworkRouter`.
 *
 * Setting `pattern` property on React component can simplify the task of
 * associating a component with a URL pattern.
 * A convenient TypeScript type is provided for this purpose.
 */
export type KeyworkRouteComponent<P = {}> = ComponentType<P> & {
  pathname?: string
}

/**
 * Predicate for determining if a value is a `KeyworkRouteComponent`.
 */
export function isKeyworkRouteComponent(input: any): input is KeyworkRouteComponent {
  return Boolean(input && typeof input === 'function' && 'pathname' in input)
}

/**
 * Either an instance of `URLPattern`,
 * or a string representing the `pathname` portion of a `URLPattern`
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern URLPattern Constructor via MDN}
 */
export type URLPatternLike = URLPatternInit | string | URL | KeyworkRouteComponent<any>

interface NormalizeURLPatternOptions {
  /**
   * Append a wildcard matcher to the `pathname` pattern.
   * This is applicable if the pattern is used to mount middleware.
   */
  appendWildcard: boolean
}

export function normalizeURLPatternInput(patternLike: URLPatternLike): URLPatternInput {
  if (!patternLike) throw new KeyworkResourceError('`patternLike` must be defined')

  if (isURLPathname(patternLike)) return URLPathnameToURLPatternInput(patternLike)

  if (isKeyworkRouteComponent(patternLike)) return normalizeURLPattern(patternLike.pathname!)

  if (patternLike instanceof URL) return patternLike

  return patternLike
}

/**
 * Converts a given `URLPatternLike` to `URLPattern`
 *
 * @category Type Cast
 */
export function normalizeURLPattern(patternLike: URLPatternLike, options?: NormalizeURLPatternOptions): IURLPattern {
  const input = normalizeURLPatternInput(patternLike)

  const globalLike = readGlobalScope()

  if (!globalScopeHasURLPattern(globalLike)) {
    throw new KeyworkResourceError(
      '`URLPattern` does not appear to be available in this environment. Consider using a polyfill.'
    )
  }

  if (typeof input === 'string') {
    return new globalLike.URLPattern(input)
  }

  // Note that a given input may be readonly, so we make a mutable copy.
  let { pathname = '*' } = input

  if (options?.appendWildcard && !pathname.endsWith('*')) {
    pathname += '*'
  }

  return new globalLike.URLPattern({
    ...input,
    pathname,
  })
}

export type URLPatternInput = URLPatternInit | string

export function isURLPathname(input: unknown): input is string {
  return typeof input === 'string' && (input[0] === '/' || input[0] === '*')
}

/**
 * A convenience function for converting a `PathnamePattern` to a `URLPatternInput`.
 *
 * This isn't strictly necessary, but it can be useful for type checking.
 */
export function URLPathnameToURLPatternInput(input: string): URLPathnameInput {
  return {
    pathname: input,
  }
}
