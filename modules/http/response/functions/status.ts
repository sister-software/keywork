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
 * Determines if the given HTTP status code is informational.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#information_responses}
 */
export const isInformational = (status: number) => status > 99 && status < 200

/**
 * Determines if the given HTTP status code is successful.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses}
 */
export const isSuccessful = (status: number) => status > 199 && status < 300

/**
 * Determines if the given HTTP status status is a redirection.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages}
 */
export const isRedirection = (status: number) => status > 299 && status < 400

/**
 * Determines if the given HTTP status status is a client error.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses}
 */
export const isClientError = (status: number) => status > 399 && status < 500

/**
 * Determines if the given HTTP status status is a server error.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses}
 */
export const isServerError = (status: number) => status > 499 && status < 600
