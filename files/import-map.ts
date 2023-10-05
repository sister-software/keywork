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

/**
 * @internal
 */
export interface ImportMapRecord {
  [specifier: string]: string
}

/**
 * @internal
 */
export interface ImportMapScopesRecord {
  [scope: string]: ImportMapRecord
}

/**
 * A JSON file containing an object with two properties:
 * - `imports`: an object containing a map of import specifiers to URLs.
 * - `scopes`: an object containing a map of scopes to import maps.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap | MDN}
 */
export interface ImportMap {
  $schema?: string
  _comment?: string
  packageVersion?: string
  imports: ImportMapRecord
  scopes?: ImportMapScopesRecord
}

/**
 * @internal
 */
export interface ImportMapModule {
  default: ImportMap
}

/**
 * @internal
 */
export const KEYWORK_IMPORT_MAP_FILE_NAME = 'importmap.json'

/**
 * Dynamically fetches the Keywork import map for server use.
 *
 * This is a useful utility for SSR and client-side hydration without bundling.
 */
export async function fetchImportMap(mountPoint = '/'): Promise<ImportMap> {
  // We need to use the dynamic import syntax here because the import map is
  // dynamically generated after the TypeScript's compilation step.
  const modulePath = 'keywork/importmap' + '.json'

  const { default: importMap }: ImportMapModule = await import(modulePath, {
    assert: {
      type: 'json',
    },
  })

  for (const [key, value] of Object.entries(importMap.imports)) {
    importMap.imports[key as keyof typeof importMap.imports] = value.replace('./', mountPoint)
  }

  return importMap
}
