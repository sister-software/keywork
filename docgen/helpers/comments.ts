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

import Handlebars from 'handlebars'
import { Comment } from 'typedoc'
import { camelToTitleCase } from '../utils/index.js'

export function commentsHelper() {
  Handlebars.registerHelper('comments', function (comment: Comment, includeHTMLWrappers = true) {
    const md: string[] = []
    const blockTags = comment.blockTags?.filter((tag) => tag.tag !== '@returns') || []

    if (comment.summary && includeHTMLWrappers) {
      md.push(
        //
        `<div className="comment-summary">`,
        Handlebars.helpers.comment(comment.summary),
        '</div>'
      )
    }

    for (const tag of blockTags) {
      const tagID = tag.tag.slice(1)
      const tagName = camelToTitleCase(tagID)

      if (includeHTMLWrappers) {
        md.push(
          `#### ${tagName}`,
          `<div className="comment-summary" data-tag="${tagID}">`,
          Handlebars.helpers.comment(tag.content),
          '</div>'
        )
      } else {
        md.push(`**\`${tagName}\`**\n\n${Handlebars.helpers.comment(tag.content)}`)
      }
    }

    return md.join('\n\n')
  })
}
