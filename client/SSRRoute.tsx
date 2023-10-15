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
import { normalizeURLPattern, useURLPatternResult } from '../uri/index.js'
import { useSSRPropsByPath } from './SSRPropsProvider.js'

interface RouteDataFetcherProps {
  component: React.ElementType<any>
  pathname: string
}

export const RouteWithSSR: React.FC<RouteDataFetcherProps> = ({ pathname, component: Component }) => {
  const propsByPath = useSSRPropsByPath()
  const initialPatternResult = useURLPatternResult()
  const currentPattern = normalizeURLPattern(initialPatternResult.inputs[0])
  const currentMatch = currentPattern.exec(pathname)

  if (!currentMatch) return null
  const pageProps = propsByPath.get(currentMatch.pathname.input)

  if (pageProps) {
    return <Component {...pageProps} />
  }

  return null
}
