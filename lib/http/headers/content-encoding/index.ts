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
 * A format using the Brotli algorithm.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#br MDN Documentation}
 */
export const BR = 'br'

/**
 * The Lempel-Ziv coding.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#gzip MDN Documentation}
 */
export const GZIP = 'gzip'

/**
 * @deprecated
 * The HTTP/1.1 standard also recommends that the servers supporting this
 * content-encoding should recognize x-gzip as an alias, for compatibility purposes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#gzip MDN Documentation}
 */
export const XGZIP = 'gzip'

/**
 * Using the zlib structure with the deflate compression algorithm.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#deflate MDN Documentation}
 */
export const DEFLATE = 'deflate'

/**
 * A format using the Lempel-Ziv-Welch (LZW) algorithm.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#compress MDN Documentation}
 */
export const COMPRESS = 'compress'
