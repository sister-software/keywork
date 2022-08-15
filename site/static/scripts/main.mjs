/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

const logo = `
88      a8P                                                              88
88    ,88'                                                               88
88  ,88"                                                                 88
88,d88'      ,adPPYba, 8b       d8 8b      db      d8  ,adPPba,  8b,dPPY 88   ,d8
8888"88,    a8P_____88 '8b     d8' '8b    d88b    d8' a8"    "8a 88P'    88 ,a8"
88P   Y8b   8PP"""""""  '8b   d8'   '8b  d8''8b  d8'  8b      d8 88      8888[
88     "88, "8b,   ,aa   '8b,d8'     '8bd8'  '8bd8'   "8a,  ,a8" 88      88'"Yba,
88       Y8b '"Ybbd8"'     Y88'        YP      YP      '"YbbP"'  88      88   'Y8a
                          .d8'
                          d8'
`
console.log(logo)

function fetchModuleNameFromDOM() {
  const metatag = document.querySelector('meta[property="publicImportPath"]')
  console.log('>>>>', metatag)
  return metatag?.content || null
}

function createImportURL(moduleName) {
  return new URL(`keywork/${moduleName}`, 'https://esm.sh/')
}

async function initDemo() {
  const moduleName = fetchModuleNameFromDOM()

  if (moduleName) {
    const importPath = createImportURL(moduleName)
    try {
      const mod = await import(importPath)
      window.mod = mod
    } catch (error) {
      console.debug(error)
    }

    console.info("It looks like you're reading about the Router module")
    console.info('Try it in the browser like this:')
    console.info(`import * as mod from ${importPath}`)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemo)
} else {
  initDemo()
}
