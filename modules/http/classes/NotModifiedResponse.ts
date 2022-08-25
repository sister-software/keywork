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
import { Status, STATUS_TEXT } from '../../errors/mod.ts'
import HTTP from '../../__internal/http.ts'

/**
 * Given that a request's etag header matches an server entity or resource,
 * a `NotModifiedResponse` should be sent to the requestor as an indication that the client's cache is still applicable.
 *
 * @category HTTP Response
 * @category Cache
 */
export class NotModifiedResponse extends HTTP.Response {
  constructor(etag: string) {
    super(undefined, {
      status: Status.NotModified,
      statusText: STATUS_TEXT[Status.NotModified],
      headers: { ETag: etag },
    })
  }
}
