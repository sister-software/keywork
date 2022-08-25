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
 * HTTP Status codes associated with a `Response.body === null`
 * @see {@link https://fetch.spec.whatwg.org/#null-body-status WHATWG Spec}
 *
 */
const NULL_BODY_STATUSES = new Set([101, 204, 205, 304])

/**
 * Clones a given `Response` as a mutable instance.
 */
export function cloneAsMutableResponse(response: globalThis.Response) {
  return new globalThis.Response(
    // This shouldn't be confused with `response.bodyIsUsed`
    // https://fetch.spec.whatwg.org/#dom-body-bodyused
    NULL_BODY_STATUSES.has(response.status) ? null : response.body,
    response
  )
}
