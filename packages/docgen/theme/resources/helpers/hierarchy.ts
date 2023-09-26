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

import { spaces } from '@keywork/docgen/theme/utils'
import Handlebars from 'handlebars'
import { DeclarationHierarchy } from 'typedoc'

export default function () {
  Handlebars.registerHelper('hierarchy', function (this: DeclarationHierarchy, level: number) {
    const md: string[] = []
    const symbol = level > 0 ? getSymbol(level) : '-'
    this.types.forEach((hierarchyType) => {
      if (this.isTarget) {
        md.push(`${symbol} **\`${hierarchyType}\`**`)
      } else {
        md.push(`${symbol} ${Handlebars.helpers.type.call(hierarchyType)}`)
      }
    })
    if (this.next) {
      md.push(Handlebars.helpers.hierarchy.call(this.next, level + 1))
    }
    return md.join('\n\n')
  })
}

function getSymbol(level: number) {
  return spaces(2) + [...Array(level)].map(() => '↳').join('')
}
