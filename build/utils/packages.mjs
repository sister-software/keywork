import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const projectRoot = path.resolve(__dirname, '..', '..')

export const packagesDirectory = path.join(projectRoot, 'packages')
export const packagesList = (await fs.readdir(packagesDirectory)).filter((name) => name !== '.DS_Store')

export const scope = '@keywork'

/** @typedef {import('../../package.json') T_npm_packageJSON } */

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
 * @param {T_npm_packageJSON} pkg
 * @param {boolean} [includeDev]
 * @returns {Set<string>} packageDependencies
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
 * Gets the contents of the package.json file in <pkgRoot>
 * @param {string} pkgRoot
 *
 * @returns {Promise<(T_npm_packageJSON>}
 */
export async function getPackage(pkgRoot) {
  return JSON.parse(await fs.readFile(path.join(pkgRoot, 'package.json'), 'utf8'))
}

export const rewritePlugin = () => {
  /** @type {import('esbuild').Plugin} */
  const plugin = {
    name: 'rewrite-mjs-ext',
    setup(build) {
      build.onLoad({ filter: /react/ }, (args) => {
        console.log(args)
        // if (pkgDeps.has(args.path)) return { external: true }

        // if (args.importer) {
        //   const path = changeExtension(args.path, '.cjs')
        //   return { path, external: true }
        // }
      })
    },
  }

  return plugin
}
