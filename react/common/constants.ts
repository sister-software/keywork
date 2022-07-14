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

/**
 * Server-side rendered props.
 * @ignore
 */
export type SSRPropsLike = {} | null

/**
 * The default ID assigned to the React root element.
 *
 * @example
 * ```tsx
 * <div id={KeyworkHTMLDocumentAppRoot}>{children}</div>
 * ```
 */
export const KeyworkHTMLDocumentAppRoot = 'app-root'

/**
 * The default ID assigned to the React root element.
 *
 * @example
 * ```tsx
 * <div id={KeyworkHTMLDocumentStyleRoot}>{children}</div>
 * ```
 */
export const KeyworkHTMLDocumentStyleRoot = 'style-root'

export const globalScopeSSRKey = ':KeyworkSSRProps:'
export const globalScopeSSRElementID = ':KeyworkSSRPropsElement:'

/**
 * The global key where SSR props are assigned.
 * @remarks This includes a space to prevent autocomplete from listing this key.
 */
export type GlobalScopeSSRKey = typeof globalScopeSSRKey
export interface GlobalScopeWithKeyworkSSRProps<SSRProps extends SSRPropsLike = SSRPropsLike>
  extends Record<GlobalScopeSSRKey, SSRProps> {
  document?: unknown
  location: URL
}
