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
