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

import { KeyworkResourceError, Status } from 'keywork/errors'
import { readGlobalScope } from './globals.js'

/** @internal */
const platformModulesCache = new Map<string, any>()

/**
 * @internal
 */
async function fetchCachedModule<ModuleExports extends {}>(moduleID: string | URL): Promise<ModuleExports> {
  const $moduleID = moduleID.toString()

  let cachedModule = platformModulesCache.get($moduleID) as undefined | ModuleExports
  if (!cachedModule) {
    cachedModule = await import($moduleID)
  }

  return cachedModule!
}
/**
 * Polyfills a given module-like object with an alternative module.
 *
 * @internal
 * @param fallbackModuleID e.g. 'node:stream', 'undici'
 * @param exportNames Object containing classes by their constructor names.
 */
export async function polyfillWithModule<ModuleExports extends {}>(
  fallbackModuleID: string | URL,
  exportNames: (keyof ModuleExports)[]
): Promise<ModuleExports> {
  const globalScope = readGlobalScope()
  const moduleExports = {} as ModuleExports

  for (const exportName of exportNames) {
    // First, check if the export already exists in the global scope...
    if (exportName in globalScope) {
      moduleExports[exportName] = (globalScope as any)[exportName]
      continue
    }

    const externalFallbackModule = await fetchCachedModule<ModuleExports>(fallbackModuleID)

    const fallbackModuleExports = externalFallbackModule![exportName]

    if (!fallbackModuleExports) {
      throw new KeyworkResourceError(
        `\`${String(exportName)}\` is neither the runtime's global scope,
      nor is it in the fallback module ${fallbackModuleID}. This app likely needs a polyfill.`,
        Status.FailedDependency
      )
    }

    moduleExports[exportName] = fallbackModuleExports!
  }

  return moduleExports
}
