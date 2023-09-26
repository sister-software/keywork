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

import { createContext, useContext } from 'react'

/**
 * A context for providing static props to the current route.
 */
export const StaticPropsContext = createContext({})
StaticPropsContext.displayName = 'StaticPropsContext'

/**
 * A hook for accessing the static props for the current route.
 * @returns The static props for the current route.
 */
export function useStaticProps<StaticProps extends {} = {}>() {
  return useContext(StaticPropsContext) as StaticProps
}
