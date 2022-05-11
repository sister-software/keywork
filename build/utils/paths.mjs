/**
 *
 * @param {string} filePath
 * @param {string} extension
 * @returns {import('path').ParsedPath}
 */
export function changeExtension(filePath, extension) {
  const parsedPath = path.parse(filePath)

  return parsedPath.dir + path.sep + parsedPath.name + extension
}
