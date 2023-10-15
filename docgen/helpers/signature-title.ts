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
import { ParameterReflection, ReflectionKind, SignatureReflection } from 'typedoc'
import type { MarkdownTheme } from '../theme/index.js'

export function signatureTitleHelper(_theme: MarkdownTheme) {
  Handlebars.registerHelper(
    'signatureTitle',
    function (this: SignatureReflection, accessor?: string, standalone = true) {
      const md: string[] = []

      // if (standalone && !theme.hideMembersSymbol) {
      //   md.push(`${memberSymbol(this)} `)
      // }

      if (this.parent && this.parent.flags?.length > 0) {
        md.push(this.parent.flags.map((flag) => `\`${flag}\``).join(' ') + ' ')
      }

      if (accessor) {
        md.push(`\`${accessor}\` **\`${this.name}\`**`)
      } else if (this.name !== '__call' && this.name !== '__type') {
        md.push(`**\`${this.name}\`**`)
      }

      md.push('\n```ts\n')
      if (this.typeParameters) {
        md.push(`${this.name}<${this.typeParameters.map((typeParameter) => typeParameter.name).join(', ')}>`)
      }
      md.push(`(${getParameters(this.parameters, false)})`)

      if (this.type && !this.parent?.kindOf(ReflectionKind.Constructor)) {
        md.push(`: ${Handlebars.helpers.type.call(this.type, 'object')}`)
      }
      md.push('\n```')

      return md.join('') + (standalone ? '\n' : '')
    }
  )
}

const getParameters = (parameters: ParameterReflection[] = [], backticks = true) => {
  return parameters
    .map((param) => {
      const paramsmd: string[] = []
      if (param.flags.isRest) {
        paramsmd.push('...')
      }
      const paramItem = `${param.name}${param.flags.isOptional || param.defaultValue ? '?' : ''}`
      paramsmd.push(backticks ? `\`${paramItem}\`` : paramItem)
      return paramsmd.join('')
    })
    .join(', ')
}
