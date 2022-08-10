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

import semver from 'semver'
import cp from 'child_process'
import commandExists from 'command-exists'
import { readNPMPackageJSON } from '@keywork/monorepo/common/imports'

interface Dependency {
  label: string
  expected: semver.Range
  given: semver.SemVer
}

const log = console.log.bind(console, '[build:check]')
const warn = console.warn.bind(console, '[build:check]')

function exitWithErrorMessage(...messages: string[]): void {
  warn(...messages)
  process.exit(1)
}

const packageJSON = await readNPMPackageJSON()

log('Checking package manager...')
if (!process.env['npm_execpath']!.includes('yarn')) {
  exitWithErrorMessage('Please use yarn to build Keywork')
}

log('Checking OS...')
if (process.platform !== 'linux' && process.platform !== 'darwin') {
  warn(`Development of Keywork on (${process.platform}) is not officially supported`)
}

try {
  await commandExists('deno')
} catch (error) {
  exitWithErrorMessage("Deno doesn't appear to be installed", 'https://deno.land/#installation')
}

const dependencies: Dependency[] = [
  {
    label: 'Node',
    expected: new semver.Range(packageJSON.engines.node),
    given: semver.coerce(process.versions.node)!,
  },
  {
    label: 'Deno',
    expected: new semver.Range(packageJSON.engines.deno),
    given: semver.coerce(cp.execSync('deno eval "console.log(Deno.version.deno)"', { encoding: 'utf8' }).trim())!,
  },

  {
    label: 'Yarn',
    expected: new semver.Range(semver.coerce(packageJSON.packageManager)!.format()),
    given: semver.coerce(cp.execSync('yarn -v', { encoding: 'utf8' }).trim())!,
  },
]

log('Checking dependencies...')

for (const dependency of dependencies) {
  if (!semver.satisfies(dependency.given, dependency.expected)) {
    exitWithErrorMessage(
      `Given dependency "${
        dependency.label
      }" version (${dependency.given.format()}) does not satsify Keywork package version (${dependency.expected.format()})`
    )
  }
}
