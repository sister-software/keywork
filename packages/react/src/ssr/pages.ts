import { matchPath, PathPattern } from '@keywork/responder'
import { SSRPropsLike } from './props'

/**
 * A **client-side** mapping of path patterns to their respective page components.
 * This is useful if your app bundles all React route handlers into a single Worker.
 *
 * @remark While this allows `PathPattern` objects, this matching isn't yet fully supported.
 *
 * @example <caption>A collection of patterns to their respective React components.</caption>
 * Order your routes from most to least specific:
 *
 *           ```ts
 *           export const routeRecords = new PatternToPageComponentMap<any>([
 *             ['/todos/:todoSlug/:subTaskSlug/', TodoSubTaskPage],
 *             ['/todos/:todoSlug/', TodoPage],
 *             ['/todos/', TodosIndexPage],
 *             ['/about/', AboutPage],
 *             ['/privacy/', PrivacyPage],
 *             ['/', IndexPage],
 *             ['*', NotFoundErrorPage],
 *           ])
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
