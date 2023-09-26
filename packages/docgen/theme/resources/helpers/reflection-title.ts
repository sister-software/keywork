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
import type { MarkdownTheme } from '@keywork/docgen/theme/MarkdownTheme'
import { escapeChars } from '@keywork/docgen/theme/utils'
import { parseModel } from '@keywork/docgen/theme/utils/model'
import dashify from 'dashify'
import Handlebars from 'handlebars'
import { PageEvent, SignatureReflection } from 'typedoc'

export default function (_theme: MarkdownTheme) {
  Handlebars.registerHelper('reflectionTitle', function <
    T extends SignatureReflection,
  >(this: PageEvent<T>, shouldEscape = true) {
    const parsedModel = parseModel(this.model)

    return [
      `# ${shouldEscape ? escapeChars(parsedModel.title) : parsedModel.title} {.kind-${dashify(
        parsedModel.kindString
      )}}`,
      parsedModel.isModule ? '## Module Overview' : '## Overview',
    ].join('\n\n')
  })
}
