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

import { createContext, useContext, useMemo } from 'react'

import { DEFAULT_LOG_LEVEL, DEFAULT_LOG_PREFIX, KeyworkLogLevel, KeyworkLogger } from 'keywork/utils'

export const KeyworkLoggerContext = createContext<KeyworkLogger>(new KeyworkLogger())
KeyworkLoggerContext.displayName = 'KeyworkLoggerContext'

/**
 * Hook to get the nearest Keywork `Logger` instance.
 */
export const useKeyworkLogger = () => useContext(KeyworkLoggerContext)

export interface KeyworkLoggerProviderProps {
  logPrefix?: string
  logLevel?: KeyworkLogLevel
  children: React.ReactNode
}

export const KeyworkLoggerProvider: React.FC<KeyworkLoggerProviderProps> = ({
  logPrefix = DEFAULT_LOG_PREFIX,
  logLevel = DEFAULT_LOG_LEVEL,
  children,
}) => {
  const logger = useMemo(() => new KeyworkLogger(logPrefix, logLevel), [logPrefix, logLevel])

  return <KeyworkLoggerContext.Provider value={logger}>{children}</KeyworkLoggerContext.Provider>
}
