import { build } from 'esbuild'
import FastGlob from 'fast-glob'
import generatorPkg from 'npm-dts'
import { cleanBuild } from './utils/clean.mjs'
import { readJSON } from './utils/files.mjs'
import { appRoot, changeExtension } from './utils/paths.mjs'
import { getPackageDependencies } from './utils/shims.mjs'

const { Generator } = generatorPkg
const env = process.env.NODE_ENV || 'development'
const isWatching = process.argv.some((arg) => arg === '--watch')
const buildDir = appRoot.bind(null, 'dist')

async function buildPackage() {
  await cleanBuild(buildDir())

  const pkgJSON = await readJSON(appRoot('package.json'))
  const pkgDeps = getPackageDependencies(pkgJSON, true)
  const entryPoints = await FastGlob(appRoot('src/**/*.{ts,mts,cts}'))

  /** @type {import('esbuild').BuildOptions} */
  const buildOptions = {
    entryPoints,
    watch: isWatching,
    target: 'esnext',
    sourcemap: true,
    sourcesContent: false,
    logLevel: isWatching ? 'info' : 'warning',
    keepNames: true,
    treeShaking: true,
    minify: env === 'production',
  }

  await Promise.all([
    build({
      ...buildOptions,
      external: Array.from(pkgDeps),
      bundle: true,
      format: 'cjs',
      outExtension: {
        '.js': '.cjs',
      },
      outdir: buildDir('cjs'),
      plugins: [
        {
          name: 'rewrite-mjs-ext',
          setup(build) {
            build.onResolve({ filter: /.mjs$/ }, (args) => {
              if (pkgDeps.has(args.path)) return { external: true }

              if (args.importer) {
                const path = changeExtension(args.path, '.cjs')
                console.log(path, args.path)
                return { path, external: true }
              }
            })
          },
        },
      ],
    }),
    build({
      ...buildOptions,
      format: 'esm',
      outExtension: {
        '.js': '.mjs',
      },
      outdir: buildDir('esm'),
    }),
  ])

  const typeGenerator = new Generator({
    entry: appRoot('src', 'index.mts'),
    output: buildDir('index.d.ts'),
  })

  await typeGenerator.generate()
}

export default buildPackage()
