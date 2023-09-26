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

import { repoRootPathBuilder } from '@keywork/docgen/paths'
import * as path from 'node:path'

/** Prepared TS output for distribution. */
export const OutDirectory = repoRootPathBuilder('dist')
export const BuildManifest = 'build-manifest.json'
export const OutBuildManifest = path.join(OutDirectory, BuildManifest)
export const DocsDirectory = repoRootPathBuilder('docs')
export const DocsAPIDirectory = repoRootPathBuilder('docs', 'modules')
export const TSConfig = 'tsconfig.json'
/** Source content. */
export const ModulesDirectory = repoRootPathBuilder('modules')
export const ImportMap = path.join(ModulesDirectory, 'import_map.json')
export const PackageJSON = 'package.json'
export const NodeModules = 'node_modules'
export const MarkdownIndex = 'index.md'
export const Category = '_category_.json'
export const CNAME = 'CNAME'
export const ModuleIndex = 'modules.md'
