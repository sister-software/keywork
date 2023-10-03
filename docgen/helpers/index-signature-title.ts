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

export function indexSignatureTitleHelper() {
  Handlebars.registerHelper('indexSignatureTitle', function (this: SignatureReflection) {
    const md = ['▪']
    const parameters = this.parameters
      ? this.parameters.map((parameter) => {
          return `${parameter.name}: ${Handlebars.helpers.type.call(parameter.type)}`
        })
      : []
    md.push(`[${parameters.join('')}]: ${Handlebars.helpers.type.call(this.type)}`)
    return md.join(' ')
  })
}
