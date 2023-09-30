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
import type { CommentDisplayPart } from 'typedoc'
import type { MarkdownTheme } from '../../MarkdownTheme.js'

export function commentHelper(_theme: MarkdownTheme) {
  Handlebars.registerHelper('comment', function (parts: CommentDisplayPart[]) {
    const result: string[] = []
    for (const part of parts) {
      switch (part.kind) {
        case 'text':
        case 'code':
          result.push(part.text)
          break
        case 'inline-tag':
          switch (part.tag) {
            case '@label':
            case '@inheritdoc':
              break
            case '@link':
            case '@linkcode':
            case '@linkplain': {
              if (part.target) {
                const url =
                  typeof part.target === 'string' ? part.target : Handlebars.helpers.relativeURL(part.target.url)
                const wrap = part.tag === '@linkcode' ? '`' : ''
                result.push(url ? `[${wrap}${part.text}${wrap}](${url})` : part.text)
              } else {
                result.push(part.text)
              }
              break
            }
            default:
              result.push(`{${part.tag} ${part.text}}`)
              break
          }
          break
        default:
          result.push('')
      }
    }

    return result.join('')
  })
}
