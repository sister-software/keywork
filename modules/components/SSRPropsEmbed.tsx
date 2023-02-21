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

import React, { FC } from 'https://esm.sh/react@18.2.0'
import { globalScopeSSRKey } from './functions/globalScopeSSRKey.ts'

export interface SSRProviderProps<StaticProps extends {}> {
  staticProps: StaticProps
}

export const globalScopeSSRElementID = ':KeyworkSSRPropsElement:'

/**
 * Embeds the given SSR props in the DOM for client-side hydration.
 * @internal This is primarily used by `KeyworkStaticPropsRequestHandler`
 */
export const _SSRPropsEmbed: FC<SSRProviderProps<any>> = ({ staticProps }) => {
  return (
    <script
      id={globalScopeSSRElementID}
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
