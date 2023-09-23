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
import { stripLineBreaks } from 'keywork/__internal/typedoc/theme/utils'
import { TypeParameterReflection } from 'typedoc'

export default function () {
  Handlebars.registerHelper('typeParameterTable', function (this: TypeParameterReflection[]) {
    return table(this)
  })
}

function table(parameters: any) {
  const showTypeCol = hasTypes(parameters)

  const comments = parameters.map((param: any) => !!param.comment?.hasVisibleComponent())

  const hasComments = !comments.every((value: any) => !value)

  const headers = ['Name']

  if (showTypeCol) {
    headers.push('Type')
  }

  if (hasComments) {
    headers.push('Description')
  }

  const rows = parameters.map((parameter: any) => {
    const row: string[] = []

    row.push(`\`${parameter.name}\``)

    if (showTypeCol) {
      const typeCol: string[] = []
      if (!parameter.type && !parameter.default) {
        typeCol.push(`\`${parameter.name}\``)
      }
      if (parameter.type) {
        typeCol.push(`extends ${Handlebars.helpers.type.call(parameter.type, 'object')}`)
      }
      if (parameter.default) {
        if (parameter.type) {
          typeCol.push(' = ')
        }
        typeCol.push(Handlebars.helpers.type.call(parameter.default))
      }
      row.push(typeCol.join(''))
    }

    if (hasComments) {
      if (parameter.comment?.summary) {
        row.push(stripLineBreaks(Handlebars.helpers.comment(parameter.comment?.summary)).replace(/\|/g, '\\|'))
      } else {
        row.push('-')
      }
    }
    return `| ${row.join(' | ')} |\n`
  })

  const output = `\n| ${headers.join(' | ')} |\n| ${headers.map(() => ':------').join(' | ')} |\n${rows.join('')}`
  return output
}

function hasTypes(parameters: TypeParameterReflection[]) {
  const types = (parameters as TypeParameterReflection[]).map((param) => !!param.type || !!param.default)
  return !types.every((value) => !value)
}
