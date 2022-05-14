export type SSRPropsLike = {} | null

export type SSRPropsByPath<SSRP extends SSRPropsLike = null> = Map<string, SSRP>

export interface WindowAndKeyworkSSRProps {
  __ssr_props_by_path: SSRPropsByPath
}
