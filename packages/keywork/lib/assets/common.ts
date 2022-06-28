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
 * Asset binding aliases common associated with Cloudflare Pages and Worker Sites.
 *
 * @category Asset Router
 */
export enum AssetBindingAliases {
  /**
   * An asset environment binding available within Cloudflare Pages.
   *
   * @remarks
   * This binding only exists in Cloudflare __Pages__.
   *
   * @see {KeyworkAssetsRouter} For use with Cloudflare Pages
   */
  CloudflarePages = 'ASSETS',

  /**
   * An environment binding available within Worker Sites.
   * This is often used with the `@cloudflare/kv-asset-handler` package.
   *
   * @remarks
   * This binding only exists in Worker __Sites__.
   * Cloudflare __Pages__ instead uses `env.ASSETS`
   *
   * @see {WorkersSiteStaticContentBinding} For Worker Sites
   */
  WorkersSites = '__STATIC_CONTENT',
}
