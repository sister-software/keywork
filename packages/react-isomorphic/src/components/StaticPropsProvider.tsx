/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import React from 'react'
import { createContextAndNamedHook } from '../hooks/createNamedContextHook.js'
import { SSRPropsLike } from '../ssr/index.js'

const [StaticPropsContext, useStaticProps] = createContextAndNamedHook<SSRPropsLike>()
export { useStaticProps }

export interface StaticPropsProvider<StaticProps extends NonNullable<SSRPropsLike>> {
  staticProps: StaticProps
  children: React.ReactNode
}

export type StaticPropsProviderComponent<StaticProps extends NonNullable<SSRPropsLike> = NonNullable<SSRPropsLike>> =
  React.FC<StaticPropsProvider<StaticProps>>

export const StaticPropsProvider: StaticPropsProviderComponent = ({ staticProps, children }) => {
  return <StaticPropsContext.Provider value={staticProps}>{children}</StaticPropsContext.Provider>
}
