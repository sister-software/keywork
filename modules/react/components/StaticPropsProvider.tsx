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

import React, { FC, ReactNode } from 'https://esm.sh/react@18.2.0'
import { createContextAndNamedHook } from '../functions/createNamedContextHook.ts'

const [StaticPropsContext, useStaticProps] = createContextAndNamedHook<{}>()
export { useStaticProps }

export interface StaticPropsProvider<StaticProps extends {}> {
  staticProps: StaticProps
  children: ReactNode
}

export type StaticPropsProviderComponent<StaticProps extends {} = {}> = FC<StaticPropsProvider<StaticProps>>

export const StaticPropsProvider: StaticPropsProviderComponent = ({ staticProps, children }) => {
  return <StaticPropsContext.Provider value={staticProps}>{children}</StaticPropsContext.Provider>
}
