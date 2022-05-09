import * as path from 'path'
import { loadConfig as loadTSconfig } from 'tsconfig-paths'
const logger = console

const tsConfig = loadTSconfig()
if (tsConfig.resultType === 'failed') throw new Error('TS Config not found.')

export const appRoot = path.join.bind(null, tsConfig.absoluteBaseUrl)

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
