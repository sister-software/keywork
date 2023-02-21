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

import { polyfillWithModule } from '../__internal/functions/polyfillWithModule.ts'

type URLPatternModule = {
  URLPattern: typeof URLPattern
}

/**
 * @internal
 */
export function polyfillURLPattern() {
  return polyfillWithModule<URLPatternModule>('urlpattern-polyfill', ['URLPattern'])
}

/**
 * Either an instance of `URLPattern`,
 * or a string representing the `pathname` portion of a `URLPattern`
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern URLPattern Constructor via MDN}
 */
export type URLPatternLike = URLPattern | string

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
export function normalizeURLPattern(patternLike: URLPatternLike, options?: NormalizeURLPatternOptions) {
  const input: URLPatternInput =
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

  const urlPattern = new URLPattern({
    ...input,
    pathname,
  })

  return urlPattern
}

/**
 * Converts a given `URLPatternInput` to `URLPatternI nit`
 *
 * @category Type Cast
 */
export function normalizeURLPatternInput(input: URLPatternInput): URLPatternInit {
  return typeof input === 'string' ? { pathname: input } : input
}
