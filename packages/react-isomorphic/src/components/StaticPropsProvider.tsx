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
