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

import Negotiator from 'negotiator'
import { fileExtensionToContentTypeHeader } from '../http/headers/index.js'
/**
 * Create a new Accepts object for the given headers.
 *
 * @param {Headers} headers
 * @public
 */
export class Accepts {
  private headers: Headers
  private negotiator: Negotiator

  constructor(headers: Headers) {
    this.headers = headers
    this.negotiator = new Negotiator({ headers: this.headers as any })
  }

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `undefined`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     this.types(['html']);
   *     // => ["html"]
   *
   *     // Accept: text/*, application/json
   *     this.types(['html']);
   *     // => ["html"]
   *     this.types(['text/html']);
   *     // => ["text/html"]
   *     this.types(['json', 'text']);
   *     // => ["json"]
   *     this.types(['application/json']);
   *     // => ["application/json"]
   *
   *     // Accept: text/*, application/json
   *     this.types(['image/png']);
   *     this.types(['png']);
   *     // => []
   *
   *     // Accept: text/*;q=.5, application/json
   *     this.types(['html', 'json']);
   *     // => ["json"]
   *
   * @param {Array} types...
   * @return {Array|String|False}
   * @public
   */
  types(types?: string[]): string[] | string | false {
    // no types, return all requested types
    if (!types || types.length === 0) {
      return this.negotiator.mediaTypes()
    }

    // no accept header, return first given type
    if (!this.headers.get('accept')) {
      return types[0]
    }

    const mimes = types.map((type) => fileExtensionToContentTypeHeader(type)['Content-Type'])

    const accepts = this.negotiator.mediaTypes(mimes.filter((t) => t && typeof t === 'string') as string[])
    const first = accepts[0]
    return first ? types[mimes.indexOf(first)] : false
  }

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ['gzip', 'deflate']
   *
   * @param {Array} encodings...
   * @return {Array|String|False}
   * @public
   */
  encodings(encodings?: string[]): string[] | string {
    // no encodings, return all requested encodings
    if (!encodings || encodings.length === 0) {
      return this.negotiator.encodings()
    }

    return this.negotiator.encodings(encodings)
  }

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ['utf-8', 'utf-7', 'iso-8859-1']
   *
   * @param {Array} charsets...
   * @return {Array|String|False}
   * @public
   */
  charsets(charsets?: string[]): string[] | string | false {
    // no charsets, return all requested charsets
    if (!charsets || charsets.length === 0) {
      return this.negotiator.charsets()
    }
    return this.negotiator.charsets(charsets)[0] || false
  }

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ['es', 'pt', 'en']
   *
   * @param {Array} langs...
   * @return {Array|String|False}
   * @public
   */
  languages(languages?: string[]): string[] | string | false {
    // no languages, return all requested languages
    if (!languages || languages.length === 0) {
      return this.negotiator.languages()
    }

    return this.negotiator.languages(languages)[0] || false
  }
}
