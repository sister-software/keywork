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
import { KeyworkResourceError } from 'keywork/errors'
import { KeyworkLogLevel, KeyworkLogger } from 'keywork/logging'
import { isKeyworkClientModule } from 'keywork/uri'
import { hydrateRoot } from 'react-dom/client'
import { pluckKeyworkHydrationElement, waitUntilDOMReady } from './dom.js'

export interface KeyworkHydrationOptions {
  logLevel?: KeyworkLogLevel
  logPrefix?: string
  scriptPath?: string
}

export async function hydrate({
  logPrefix = 'Hydration',
  logLevel = KeyworkLogLevel.Log,
  scriptPath = '/main.js',
}: KeyworkHydrationOptions = {}) {
  const logger = new KeyworkLogger(logPrefix, logLevel)
  await waitUntilDOMReady()
  const hydrationElement = pluckKeyworkHydrationElement()

  logger.info('DOM is ready!', hydrationElement)

  const mainModule = await import(scriptPath)

  if (!isKeyworkClientModule(mainModule)) {
    throw new KeyworkResourceError('Keywork client module is invalid.', mainModule)
  }

  hydrateRoot(hydrationElement, mainModule.default as any)
}
