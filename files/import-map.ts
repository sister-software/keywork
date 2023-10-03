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
  imports: ImportMapRecord
  scopes?: ImportMapScopesRecord
}

/**
 * @internal
 */
export const KEYWORK_IMPORT_MAP_FILE_NAME = 'import_map.json'
