/** Returns the given `fileName` extension. */
export const fileNameToExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex === -1 ? '' : fileName.slice(dotIndex + 1)
}
