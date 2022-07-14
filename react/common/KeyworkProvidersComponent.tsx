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

import type { FC, ReactNode } from 'react'

export interface ProviderWrapperProps {
  children: ReactNode
}

/**
 * A component which wraps the current SSR routes.
 * Use this if you need to inject a provider into the SSR pipeline.
 */
export type KeyworkProvidersComponent = FC<ProviderWrapperProps>

export const KeyworkProviders: KeyworkProvidersComponent = ({ children }) => {
  return <>{children}</>
}
