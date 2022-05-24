export enum KeyworkQueryParamKeys {
  /** The current build ID. Used to bust caches on static assets. */
  BuildID = 'build-id',
  /**
   * A boolean-like query param that hints to the worker that client-side React
   * only needs the static props for an upcoming page transition.
   */
  StaticProps = 'static-props',
}
