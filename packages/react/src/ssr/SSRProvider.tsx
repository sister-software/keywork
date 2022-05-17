import React from 'react'
import { SSRPropsByPath } from './props.mjs'

export interface SSRProviderProps {
  ssrPropsByPath: SSRPropsByPath
}

/**
 * Embeds the given SSR props in the DOM for client-side hydration.
 */
export const SSRProvider: React.FC<SSRProviderProps> = ({ ssrPropsByPath }) => {
  return (
    <script
      id="__ssr_props-container"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `;(function() {
          const encoded = \`${encodeURIComponent(JSON.stringify(Object.fromEntries(ssrPropsByPath)))}\`;
          window.__ssr_props_by_path = JSON.parse(decodeURIComponent(encoded));
        }())`,
      }}
    />
  )
}
