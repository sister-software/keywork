import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const projectRoot = path.resolve(__dirname, '..', '..')

export const pkgsDir = path.join(projectRoot, 'packages')
export const pkgsList = (await fs.readdir(pkgsDir)).filter((name) => name !== '.DS_Store')

export const scope = '@keywork'

/**
 * Recursively walks a directory, returning a list of all files contained within
 * @param {string} rootPath
 * @returns {Promise<string[]>}
 */
export async function walk(rootPath) {
  const fileNames = await fs.readdir(rootPath)
  const walkPromises = fileNames.map(async (fileName) => {
    const filePath = path.join(rootPath, fileName)
    return (await fs.stat(filePath)).isDirectory() ? await walk(filePath) : [filePath]
  })
  return (await Promise.all(walkPromises)).flat()
}

/**
 * Gets a list of dependency names from the passed package
 * @param {~Package} pkg
 * @param {boolean} [includeDev]
 * @returns {Set<string>}
 */
export function getPackageDependencies(pkg, includeDev) {
  return new Set([
    ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
    ...(includeDev && pkg.devDependencies ? Object.keys(pkg.devDependencies) : []),
    ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
    ...(pkg.optionalDependencies ? Object.keys(pkg.optionalDependencies) : []),
  ])
}

/**
 * @typedef {object} ~Package
 * @property {string} name
 * @property {string} version
 * @property {Record<string, string>} [dependencies]
 * @property {Record<string, string>} [devDependencies]
 * @property {Record<string, string>} [peerDependencies]
 * @property {Record<string, string>} [optionalDependencies]
 * @property {string[]} [entryPoints]
 */

/**
 * Gets the contents of the package.json file in <pkgRoot>
 * @param {string} pkgRoot
 * @returns {Promise<~Package>}
 */
export async function getPackage(pkgRoot) {
  return JSON.parse(await fs.readFile(path.join(pkgRoot, 'package.json'), 'utf8'))
}

/**
 * Sets the contents of the package.json file in <pkgRoot>
 * @param {string} pkgRoot
 * @param {~Package} pkg
 * @returns {Promise<void>}
 */
export async function setPackage(pkgRoot, pkg) {
  await fs.writeFile(path.join(pkgRoot, 'package.json'), JSON.stringify(pkg, null, 2) + '\n', 'utf8')
}
