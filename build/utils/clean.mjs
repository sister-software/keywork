import rimraf from 'rimraf'

/**
 * @param {string} dirtyDirectoryPath
 * @returns {Promise<void>}
 */
export function cleanBuild(dirtyDirectoryPath) {
  return new Promise((resolve, reject) => {
    console.info(dirtyDirectoryPath, 'Clearing path...')
    rimraf(dirtyDirectoryPath, (error) => {
      if (error) {
        return reject(error)
      }
      console.info(dirtyDirectoryPath, 'Cleared!')
      return resolve()
    })
  })
}
