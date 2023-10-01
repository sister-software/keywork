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
 * The default ID assigned to the React root element.
 *
 * ```tsx
 * <div id={KeyworkHTMLDocumentAppRoot}>{children}</div>
 * ```
 * @ignore
 */
export const KEYWORK_APP_ROOT = 'app-root'

/**
 * The default ID assigned to the React root style element.
 *
 * ```tsx
 * <div id={KeyworkHTMLDocumentStyleRoot}>{children}</div>
 * ```
 * @ignore
 */
export const KEYWORK_STYLE_ROOT = 'style-root'

export type KeyworkSSRPropsKey = ':KeyworkSSRProps:'

/**
 * The global key where the SSR props are assigned.
 * This includes a ':' character to prevent `document.querySelector` from matching this key.
 * @internal
 */
export const KEYWORK_SSR_PROPS_KEY: KeyworkSSRPropsKey = ':KeyworkSSRProps:'

export type KeyworkSSRInitKey = ':KeyworkSSREventInit:'

/**
 * The global key where the SSR event init is assigned.
 * This includes a ':' character to prevent `document.querySelector` from matching this key.
 * @internal
 */
export const KEYWORK_SSR_INIT_KEY: KeyworkSSRInitKey = ':KeyworkSSREventInit:'
