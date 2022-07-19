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

/**
 * An object that has a `url` property.
 *
 * @category Type Cast
 */
export type RequestLike = { url: string }

/**
 * An object that has a `pathname` property.
 *
 * @category Type Cast
 */
export type URLLike = { pathname: string }

/**
 * Checks if the given object is shaped like a `Request`
 * @param requestish An object that's possibly a `Request`
 * @category Type Cast
 */
export function isRequestLike(requestish: unknown): requestish is RequestLike {
  return Boolean(requestish && typeof requestish === 'object' && (requestish as any).url)
}

/**
 * Checks if the given object is shaped like a `URL`
 * @param urlish An object that's possibly a `URL`
 * @category Type Cast
 */
export function isURLLike(urlish: unknown): urlish is URLLike {
  return Boolean(urlish && typeof urlish === 'object' && (urlish as any).pathname)
}
