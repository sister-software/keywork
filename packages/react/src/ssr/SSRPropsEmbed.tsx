import React from 'react'
import { globalScopeSSRKey, SSRPropsLike } from './props.js'

export interface SSRProviderProps<StaticProps extends NonNullable<SSRPropsLike>> {
  staticProps: StaticProps
}

/**
 * Embeds the given SSR props in the DOM for client-side hydration.
 * @internal This is primarily used by `KeyworkStaticPropsRequestHandler`
 */
export const SSRPropsEmbed: React.FC<SSRProviderProps<any>> = ({ staticProps }) => {
  return (
    <script
      id="__ssr_props-container"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `;(function() {
          const encoded = \`${encodeURIComponent(JSON.stringify(staticProps))}\`;
          self[${JSON.stringify(globalScopeSSRKey)}] = JSON.parse(decodeURIComponent(encoded));
        }())`,
      }}
    />
  )
}
