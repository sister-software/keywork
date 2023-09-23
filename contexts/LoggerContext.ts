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

import { Logger, LogLevel } from 'keywork/logger'

export const LoggerContext = createContext<LogLevel>(LogLevel.Warning)

export function useLogger(logPrefix: string): Logger {
  const level = useContext(LoggerContext)
  const logger = useMemo(() => new Logger(logPrefix, level), [level, logPrefix])

  return logger
}
