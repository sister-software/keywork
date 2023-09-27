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
import type { MarkdownTheme } from 'keywork/docgen/theme/MarkdownTheme'
import { stripComments, stripLineBreaks } from 'keywork/docgen/theme/utils'
import { DeclarationReflection, LiteralType, ParameterReflection, ReflectionKind, ReflectionType } from 'typedoc'

function getType(reflection: ParameterReflection | DeclarationReflection) {
  const reflectionType = reflection.type as ReflectionType
  if (reflectionType && reflectionType.declaration?.children) {
    return ': `Object`'
  }

  const prefix = reflection.parent?.kindOf(ReflectionKind.Enum) ? ' = ' : ': '

  return prefix + Handlebars.helpers.type.call(reflectionType ? reflectionType : reflection, 'object')
}

export default function (_theme: MarkdownTheme) {
  Handlebars.registerHelper('declarationTitle', function (this: ParameterReflection | DeclarationReflection) {
    const md = ['```ts\n']

    if (this.flags && this.flags.length > 0 && !this.flags.isRest) {
      md.push(this.flags.map((flag) => flag.toLowerCase()).join(' '), ' ')
    }

    md.push([this.flags.isRest ? '... ' : '', this.name].filter(($) => $).join(' '))
    if (this instanceof DeclarationReflection && this.typeParameters) {
      md.push(`<${this.typeParameters.map((typeParameter) => typeParameter.name).join(', ')}>`)
    }

    md.push(getType(this))

    if (!(this.type instanceof LiteralType) && this.defaultValue && this.defaultValue !== '...') {
      md.push(` = \`${stripLineBreaks(stripComments(this.defaultValue))}\``)
    }

    md.push('\n```')
    return md.join('')
  })
}
