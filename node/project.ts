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

import * as path from 'node:path'
import { projectRootPathBuilder } from './paths.js'

/** Prepared TS output for distribution. */
const OutDirectory = projectRootPathBuilder('dist')
const BuildManifest = 'build-manifest.json'
const OutBuildManifest = path.join(OutDirectory, BuildManifest)
const DocsDirectory = projectRootPathBuilder('docs')
const DocsAPIDirectory = projectRootPathBuilder('docs', 'modules')
const TSConfig = 'tsconfig.json'
/** Source content. */
const ModulesDirectory = projectRootPathBuilder('modules')
const ImportMap = path.join(ModulesDirectory, 'import_map.json')
const PackageJSON = 'package.json'
const NodeModules = 'node_modules'
const MarkdownIndex = 'index.md'
const Category = '_category_.json'
const CNAME = 'CNAME'
const ModuleIndex = 'modules.md'

/**
 * @internal
 */
export const ProjectFiles = {
  BuildManifest,
  CNAME,
  Category,
  DocsAPIDirectory,
  DocsDirectory,
  ImportMap,
  MarkdownIndex,
  ModuleIndex,
  ModulesDirectory,
  NodeModules,
  OutBuildManifest,
  OutDirectory,
  PackageJSON,
  TSConfig,
} as const
