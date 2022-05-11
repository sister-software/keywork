type SSRPropsLike = {} | null

type SSRPropsByPath<SSRP extends SSRPropsLike = null> = Map<string, SSRP>

interface WindowAndKeyworkSSRProps {
  __ssr_props_by_path: SSRPropsByPath
}
