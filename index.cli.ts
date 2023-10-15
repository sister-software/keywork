#!/usr/bin/env node
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

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { serveBuilder, serveCommand } from './cli/index.js'

const cli = yargs(hideBin(process.argv), process.cwd())
  // --
  .scriptName('keywork')
  .config('keywork')
  .strict()
  .wrap(72)

cli
  // --
  .command('serve <publicDir>', 'Serves a Keywork Router', serveCommand, serveBuilder)
  .alias('s', 'serve')

cli.help()

await cli
  .check((argv) => {
    if (argv._.length === 0) {
      throw new Error('No command specified')
    }
    return true
  })
  .parse()
