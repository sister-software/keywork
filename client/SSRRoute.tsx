import { normalizeURLPattern, normalizeURLPatternInit, useURLPatternResult } from 'keywork/uri'
import { useSSRProps } from './SSRPropsProvider.js'

interface RouteDataFetcherProps {
  component: React.ElementType<any>
  pathname: string
}

export const RouteWithSSR: React.FC<RouteDataFetcherProps> = ({ pathname, component: Component }) => {
  const propsByPath = useSSRProps()
  const initialPatternResult = useURLPatternResult()
  const currentPattern = normalizeURLPattern(normalizeURLPatternInit(initialPatternResult.inputs[0]))
  const currentMatch = currentPattern.exec(pathname)

  if (!currentMatch) return null
  const pageProps = propsByPath.get(currentMatch.pathname.input)

  if (pageProps) {
    return <Component {...pageProps} />
  }

  return null
}
