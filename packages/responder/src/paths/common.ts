/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */
export interface PathPattern<Path extends string = string> {
  /**
   * A string to match against a URL pathname. May contain `:id`-style segments
   * to indicate placeholders for dynamic parameters. May also end with `/*` to
   * indicate matching the rest of the URL pathname.
   */
  path: Path
  /**
   * Should be `true` if the static portions of the `path` should be matched in
   * the same case.
   */
  caseSensitive?: boolean
  /**
   * Should be `true` if this pattern should match the entire URL pathname.
   */
  end?: boolean
}

/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ExpectedParams extends {} | null = null> {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: ExpectedParams
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  pathnameBase: string
  /**
   * The pattern that was used to match.
   */
  pattern: PathPattern
}

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

type ParamParseFailed = { failed: true }

type ParamParseSegment<Segment extends string> =
  // Check here if there exists a forward slash in the string.
  Segment extends `${infer LeftSegment}/${infer RightSegment}`
    ? // If there is a forward slash, then attempt to parse each side of the
      // forward slash.
      ParamParseSegment<LeftSegment> extends infer LeftResult
      ? ParamParseSegment<RightSegment> extends infer RightResult
        ? LeftResult extends string
          ? // If the left side is successfully parsed as a param, then check if
            // the right side can be successfully parsed as well. If both sides
            // can be parsed, then the result is a union of the two sides
            // (read: "foo" | "bar").
            RightResult extends string
            ? LeftResult | RightResult
            : LeftResult
          : // If the left side is not successfully parsed as a param, then check
          // if only the right side can be successfully parse as a param. If it
          // can, then the result is just right, else it's a failure.
          RightResult extends string
          ? RightResult
          : ParamParseFailed
        : ParamParseFailed
      : // If the left side didn't parse into a param, then just check the right
      // side.
      ParamParseSegment<RightSegment> extends infer RightResult
      ? RightResult extends string
        ? RightResult
        : ParamParseFailed
      : ParamParseFailed
    : // If there's no forward slash, then check if this segment starts with a
    // colon. If it does, then this is a dynamic segment, so the result is
    // just the remainder of the string. Otherwise, it's a failure.
    Segment extends `:${infer Remaining}`
    ? Remaining
    : ParamParseFailed
// Attempt to parse the given string segment. If it fails, then just return the
// plain string type as a default fallback. Otherwise return the union of the
// parsed string literals that were referenced as dynamic segments in the route.
export type ParamParseKey<Segment extends string> = ParamParseSegment<Segment> extends string
  ? ParamParseSegment<Segment>
  : string
/**
 * The parameters that were parsed from the URL path.
 */
export type ParsedPathParams<Key extends string = string> = {
  readonly [key in Key]: string | undefined
}

export type RequestLike = Pick<Request, 'url'>
export type URLLike = Pick<URL, 'pathname'>

export function isRequestLike(requestish: unknown): requestish is RequestLike {
  return Boolean(requestish && typeof requestish === 'object' && (requestish as any).url)
}

export function isURLLike(urlish: unknown): urlish is URLLike {
  return Boolean(urlish && typeof urlish === 'object' && (urlish as any).pathname)
}
