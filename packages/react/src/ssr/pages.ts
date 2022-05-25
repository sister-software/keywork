import { matchPath, PathPattern } from '@keywork/responder'
import { SSRPropsLike } from './props'

/**
 * A mapping of path patterns to their respective page components.
 *
 * @remark Order routes from most to least specific.
 * @todo While this allows `PathPattern` objects, this matching isn't yet fully supported.
 * @remark Your components will usually take different static props.
 * Using `PatternToPageComponentMap<any>` allows this.
 * @example
 * ```ts
 * export const routeRecords = new PatternToPageComponentMap([
 *   ['/todos/:todoSlug/:subTaskSlug/', TodoSubTaskPage],
 *   ['/todos/:todoSlug/', TodoPage],
 *   ['/todos/', TodosIndexPage],
 *   ['/about/', AboutPage],
 *   ['/privacy/', PrivacyPage],
 *   ['/', IndexPage],
 *   ['*', NotFoundErrorPage],
 * ])
 * ```
 */
export class PatternToPageComponentMap<StaticProps extends SSRPropsLike> extends Map<
  PathPattern | string,
  React.ComponentType<StaticProps>
> {}

export function matchRoute(patternToPageComponent: PatternToPageComponentMap<any>, location: URL) {
  for (const pattern of patternToPageComponent.keys()) {
    const possibleMatch = matchPath(pattern, location.pathname)

    if (possibleMatch) return possibleMatch
  }

  return null
}
