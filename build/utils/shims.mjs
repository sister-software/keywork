import { createRequire } from 'module'
import stdLibBrowser from 'node-stdlib-browser'
import plugin from 'node-stdlib-browser/helpers/esbuild/plugin'
const require = createRequire(import.meta.url)

export const createNodeEnvShim = () => {
  return {
    inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
    define: {
      global: 'global',
      // Buffer: 'Buffer',
    },
    plugins: [
      plugin({
        path: stdLibBrowser.path,
      }),
    ],
  }
}

export const createBuildEnvInjections = () => {
  return {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.BUILD_ID': JSON.stringify(process.env.BUILD_ID || Date.now()),
  }
}
