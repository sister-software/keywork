import * as fs from 'fs/promises'

/**
 * @param {string} filePath
 * @returns {Promise<T>}
 */
export async function readJSON(filePath) {
  const content = await fs.readFile(filePath)

  try {
    return JSON.parse(content)
  } catch (error) {
    fsLogger.error(`Error parsing ${filePath} to JSON`)
    throw error
  }
}
