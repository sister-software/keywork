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

import type { IsomorphicFetchEventInit } from 'keywork/events'
import { KEYWORK_SSR_INIT_KEY, KEYWORK_SSR_PROPS_KEY } from 'keywork/utils'
import { FC } from 'react'

export interface SSRProviderProps<StaticProps extends {}> {
  staticProps: StaticProps
  eventInit: IsomorphicFetchEventInit
}

/**
 * @internal
 * @ignore
 */
export const KEYWORK_SSR_EMBED_ID = ':KeyworkSSREmbed:'

const AS_STRING = JSON.stringify
const AS_ENCODED = (value: any) => encodeURIComponent(AS_STRING(value))

/**
 * Embeds the given SSR props in the DOM for client-side hydration.
 * @internal This is primarily used by `KeyworkStaticPropsRequestHandler`
 */
export const KeyworkSSREmbed: FC<SSRProviderProps<any>> = ({ staticProps, eventInit }) => {
  const __html = /* javascript */ `(function() {
    const encodedStaticProps = '${AS_ENCODED(staticProps)}';
    self[${AS_STRING(KEYWORK_SSR_PROPS_KEY)}] = JSON.parse(decodeURIComponent(encodedStaticProps));

    const encodedEventInit = '${AS_ENCODED(eventInit)}';
    self[${AS_STRING(KEYWORK_SSR_INIT_KEY)}] = JSON.parse(decodeURIComponent(encodedEventInit));

    document.getElementById(${AS_STRING(KEYWORK_SSR_EMBED_ID)}).remove();
  }())`

  return <script id={KEYWORK_SSR_EMBED_ID} type="text/javascript" dangerouslySetInnerHTML={{ __html }} />
}
