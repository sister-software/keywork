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
import { ContainerReflection, ReflectionKind } from 'typedoc'
import { PageEvent } from 'typedoc'

export default function () {
  Handlebars.registerHelper(
    'reflectionPath',

    function (this: PageEvent<ContainerReflection>) {
      if (this.model) {
        if (this.model.kind && this.model.kind !== ReflectionKind.Module) {
          const title: string[] = []
          if (this.model.parent && this.model.parent.parent) {
            if (this.model.parent.parent.parent) {
              title.push(
                `[${this.model.parent.parent.name}](${Handlebars.helpers.relativeURL(this.model?.parent?.parent.url)})`
              )
            }
            title.push(`[${this.model.parent.name}](${Handlebars.helpers.relativeURL(this.model.parent.url)})`)
          }
          title.push(this.model.name)
          return title.length > 1 ? `${title.join('.')}` : null
        }
      }
      return null
    }
  )
}
