/** Resolves a POSIX-like path into slash delineated segments. */
export const resolveDocPath = (...collectionPath: Array<string | undefined>): string => {
  return collectionPath
    .filter((piece) => !!piece)
    .join('/')
    .replaceAll('//', '/')
}
