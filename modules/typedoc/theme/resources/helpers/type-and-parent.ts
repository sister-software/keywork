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
import { SignatureReflection } from 'typedoc'
import { ArrayType, ReferenceType } from 'typedoc'
import { escapeChars } from '../../utils.ts'

export default function () {
  Handlebars.registerHelper('typeAndParent', function (this: ArrayType | ReferenceType) {
    const getUrl = (name: string, url: string) => `[${name}](${Handlebars.helpers.relativeURL(url)})`
    if (this) {
      if ('elementType' in this) {
        return Handlebars.helpers.typeAndParent.call(this.elementType) + '[]'
      } else {
        if (this.reflection) {
          const md: string[] = []
          if (this.reflection instanceof SignatureReflection) {
            if (this.reflection.parent?.parent?.url) {
              md.push(getUrl(this.reflection.parent.parent.name, this.reflection.parent.parent.url))
              if (this.reflection.parent.url) {
                md.push(getUrl(this.reflection.parent.name, this.reflection.parent.url))
              }
            }
          } else {
            if (this.reflection.parent?.url) {
              md.push(getUrl(this.reflection.parent.name, this.reflection.parent.url))
              if (this.reflection.url) {
                md.push(getUrl(this.reflection.name, this.reflection.url))
              }
            }
          }
          return md.join('.')
        } else {
          return escapeChars(this.toString())
        }
      }
    }
    return 'void'
  })
}
