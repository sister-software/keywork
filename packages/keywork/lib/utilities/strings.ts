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
 * Converts a given `ArrayBuffer` to a `string`.
 *
 * @category ArrayBuffer
 */
export function arrayBufferToString(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint16Array(buf) as unknown as number[])
}

/**
 * Converts a given `string` to an `ArrayBuffer`.
 *
 * @category String
 */
export function stringToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  const bufView = new Uint16Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

/**
 * Converts a given `ArrayBuffer` to a base64 encoded `string`.
 * @category ArrayBuffer
 */
export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
}

/**
 * Convenience method to get a substring's start offset.
 */
export function findSubstringStartOffset(str: string, searchStr: string): number | null {
  const indexMatch = str.indexOf(searchStr)

  if (indexMatch === -1) return null

  return indexMatch + searchStr.length
}
