import esbuild from 'esbuild'
import path from 'path'
import { getPackage, getPackageDependencies, pkgsDir, pkgsList, projectRoot, walk } from './utils/packages.mjs'

const argv = process.argv.slice(2)
const watch = argv[0] === 'watch'

/**
 * Common build options for all packages
 * @type {esbuild.BuildOptions}
 */
const buildOptions = {
  platform: 'node',
  format: 'cjs',
  target: 'esnext',
  bundle: true,
  sourcemap: true,
  sourcesContent: false,
  // Mark root package's dependencies as external, include root devDependencies
  // (e.g. test runner) as we don't want these bundled
  external: [
    ...getPackageDependencies(await getPackage(projectRoot), true),
    // Make sure we're not bundling any packages we're building, we want to
    // test against the actual code we'll publish for instance
    'keywork',
    '@keywork/*',
    // Make sure all Jest packages aren't bundled
    '@jest/*',
    'jest*',
    // Mark sites manifest as external, it's added by SitesPlugin
    '__STATIC_CONTENT_MANIFEST',
  ],
  logLevel: watch ? 'info' : 'warning',
  watch,
}

const typescriptExtPattern = /\.m[tj]s$/

/**
 * Builds a package and its tests stored in packages/<name>/
 * @param {string} name
 * @returns {Promise<void>}
 */
async function buildPackage(name) {
  const pkgRoot = path.join(pkgsDir, name)
  const pkg = await getPackage(pkgRoot)

  const indexPath = path.join(pkgRoot, 'src', 'index.mts')
  // Look for test files ending with .spec.ts in the test directory, default to
  // empty array if not found
  let testPaths = []
  try {
    testPaths = (await walk(path.join(pkgRoot, 'test'))).filter((testPath) => testPath.endsWith('.spec.ts'))
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  const outPath = path.join(pkgRoot, 'dist')

  const cjsEntryPoints = [indexPath, ...testPaths]
  // Some tests require bundled ES module fixtures (e.g. Workers Sites), so
  // build .mjs/.mts files using `format: "esm"`
  const esmEntryPoints = []

  for (const entryPoint of pkg.entryPoints ?? []) {
    const absoluteEntryPoint = path.join(pkgRoot, entryPoint)
    const collection = typescriptExtPattern.test(entryPoint) ? esmEntryPoints : cjsEntryPoints
    collection.push(absoluteEntryPoint)
  }

  const pkgBuildOptions = {
    ...buildOptions,
    external: [
      // Extend root package's dependencies with this package's
      ...buildOptions.external,
      // Exclude devDependencies, we'll use these to signal single-use/small
      // packages we want inlined in the bundle
      ...getPackageDependencies(pkg),
    ],
    outdir: outPath,
    outbase: pkgRoot,
  }
  await esbuild.build({ ...pkgBuildOptions, entryPoints: cjsEntryPoints })
  if (esmEntryPoints.length) {
    await esbuild.build({
      ...pkgBuildOptions,
      format: 'esm',
      entryPoints: esmEntryPoints,
    })
  }
}

// Bundle all packages, optionally watching
await Promise.all(pkgsList.map((pkgName) => buildPackage(pkgName)))

// import { build } from 'esbuild'
// import FastGlob from 'fast-glob'
// import { cleanBuild } from './utils/clean.mjs'
// import { readJSON } from './utils/files.mjs'
// import { appRoot, changeExtension } from './utils/paths.mjs'

// const env = process.env.NODE_ENV || 'development'
// const isWatching = process.argv.some((arg) => arg === '--watch')
// const buildDir = appRoot.bind(null, 'dist')

// async function buildPackage() {
//   await cleanBuild(buildDir())

//   const pkgJSON = await readJSON(appRoot('package.json'))
//   const pkgDeps = getPackageDependencies(pkgJSON, true)
//   const entryPoints = await FastGlob(appRoot('src/**/*.{ts,mts,cts}'))

//   /** @type {esbuild.BuildOptions} */
//   const buildOptions = {
//     entryPoints,
//     watch: isWatching,
//     target: 'esnext',
//     sourcemap: true,
//     sourcesContent: false,
//     logLevel: isWatching ? 'info' : 'warning',
//     keepNames: true,
//     treeShaking: true,
//     minify: env === 'production',
//   }

//   await Promise.all([
//     build({
//       ...buildOptions,
//       external: Array.from(pkgDeps),
//       bundle: true,
//       format: 'cjs',
//       outExtension: {
//         '.js': '.cjs',
//       },
//       outdir: buildDir('cjs'),
//       plugins: [
//         {
//           name: 'rewrite-mjs-ext',
//           setup(build) {
//             build.onResolve({ filter: /.mjs$/ }, (args) => {
//               if (pkgDeps.has(args.path)) return { external: true }

//               if (args.importer) {
//                 const path = changeExtension(args.path, '.cjs')
//                 console.log(path, args.path)
//                 return { path, external: true }
//               }
//             })
//           },
//         },
//       ],
//     }),
//     build({
//       ...buildOptions,
//       format: 'esm',
//       outExtension: {
//         '.js': '.mjs',
//       },
//       outdir: buildDir('esm'),
//     }),
//   ])

// }

// export default buildPackage()
