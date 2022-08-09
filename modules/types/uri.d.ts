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

export {}

declare global {
  interface URLPatternInit {
    baseURL?: string
    username?: string
    password?: string
    protocol?: string
    hostname?: string
    port?: string
    pathname?: string
    search?: string
    hash?: string
  }

  interface URLPatternInit {
    baseURL?: string
    username?: string
    password?: string
    protocol?: string
    hostname?: string
    port?: string
    pathname?: string
    search?: string
    hash?: string
  }

  // @ts-ignore: Duplicate type in Deno
  type URLPatternInput = URLPatternInit | string

  // @ts-ignore: Duplicate type in Deno
  class URLPattern {
    constructor(init?: URLPatternInput, baseURL?: string)

    test(input?: URLPatternInput, baseURL?: string): boolean

    exec(input?: URLPatternInput, baseURL?: string): URLPatternResult | null

    readonly protocol: string
    readonly username: string
    readonly password: string
    readonly hostname: string
    readonly port: string
    readonly pathname: string
    readonly search: string
    readonly hash: string
  }

  interface URLPatternResult {
    /** The inputs provided when matching. */
    inputs: [URLPatternInit] | [URLPatternInit, string]
    protocol: URLPatternComponentResult
    username: URLPatternComponentResult
    password: URLPatternComponentResult
    hostname: URLPatternComponentResult
    port: URLPatternComponentResult
    pathname: URLPatternComponentResult
    search: URLPatternComponentResult
    hash: URLPatternComponentResult
  }

  interface URLPatternComponentResult {
    input: string
    groups: Record<string, string>
  }
}
