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
 * @internal
 */
export type HeadersRecord = Record<string, number | boolean | string | undefined>

/**
 * Creates a `Cache-Control` header from the given object.
 * Generally, this is an internal function, but it may prove useful in unusual circumstances.
 *
 * See {@link Keywork#HTTP#Response.CachableResponse `CachableResponse`}
 *
 * @category Cache
 * @category HTTP Headers
 * @public
 */
export function castHeadersObjectToString(headersRecord: HeadersRecord): string {
  const headerValues: string[] = []

  for (const [key, value] of Object.entries(headersRecord)) {
    if (typeof value === 'boolean') {
      if (!value) continue

      headerValues.push(key)
    }

    headerValues.push(`${key}=${value}`)
  }

  return headerValues.join(', ')
}
