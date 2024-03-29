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
import { ReferenceReflection } from 'typedoc'

export function referenceMemberHelper() {
  Handlebars.registerHelper('referenceMember', function (this: ReferenceReflection) {
    const referenced = this.tryGetTargetReflectionDeep()

    if (this.hasComment()) {
      return Handlebars.helpers.comments(this.comment)
    }

    if (!referenced) {
      return `Re-exports ${this.name}`
    }

    if (this.name === referenced.name) {
      return `Re-exports [${referenced.name}](${Handlebars.helpers.relativeURL(referenced.url)})`
    }

    return `Renames and re-exports [${referenced.name}](${Handlebars.helpers.relativeURL(referenced.url)})`
  })
}
