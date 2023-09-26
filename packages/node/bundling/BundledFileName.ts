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
 * A special file name that sets Cloudflare Pages to advanced mode.
 *
 * When using a `_worker.js` file, Cloudflare Pages will be in "advanced mode".
 * Advanced mode disables the dyanmic aspects of the platform:
 *
 * - The `_worker.js` file is deployed as is and must be written using the Module Worker syntax.
 * - Your `/functions` directory will be ignored.
 * - All incoming requests will be sent to your bundled worker file.
 * - You will have parse incoming request URLS with a router such as `PatternToPageComponentMap`
 *
 * @see {PatternToPageComponentMap}
 *
 * @public
 */
export const BundledFileName = '_worker'
