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

export type PathBuilder = (...collectionPath: Array<string | undefined>) => string

/** Resolves a POSIX-like path into slash delineated segments. */
export const resolveDocPath: PathBuilder = (...collectionPath) => {
  return collectionPath
    .filter((piece) => !!piece)
    .join('/')
    .replaceAll('//', '/')
}

export function arrayBufferToString(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint16Array(buf) as unknown as number[])
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  const bufView = new Uint16Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
