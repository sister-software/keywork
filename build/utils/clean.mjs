import rimraf from 'rimraf'

/**
 * @param {string} dirtyDirectoryPath
 * @returns {Promise<void>}
 */
export function cleanBuild(dirtyDirectoryPath) {
  return new Promise((resolve, reject) => {
    console.info('Clearing path...', dirtyDirectoryPath)
    rimraf(dirtyDirectoryPath, (error) => {
      if (error) {
        return reject(error)
      }

      return resolve()
    })
  })
}
