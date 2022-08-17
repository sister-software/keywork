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
import { PageEvent, ReflectionKind, SignatureReflection } from 'typedoc'
import { escapeChars } from '../../utils.ts'
import { MarkdownTheme } from '../../theme.ts'
import * as path from 'path'

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper('reflectionTitle', function <
    T extends SignatureReflection
  >(this: PageEvent<T>, shouldEscape = true) {
    const { model } = this
    let title: string
    let declaration: string[] = []

    if (model && model.kindString && this.url !== this.project.url) {
      title = `${model.kindString}: `
    }
    if (this.url === this.project.url) {
      title = theme.indexTitle || this.project.name
    } else {
      title = shouldEscape ? escapeChars(model.name) : model.name
    }

    // const typeParameters = model.typeParameters
    //   ? `<${model.typeParameters.map((typeParameter) => typeParameter.name).join(', ')}>`
    //   : ''

    if (model.sources?.[0]) {
      const source = model.sources[0]
      const basePath = path.posix.join('keywork', path.dirname(source.fileName))
      const browserURL = new URL(basePath, 'https://esm.sh/')
      const denoURL = new URL(`/x/keywork/${source.fileName}`, 'https://deno.land')

      const importPattern = model.kindOf(ReflectionKind.Module)
        ? `import * as ${model.name}`
        : `import { ${model.originalName} }`

      declaration = [
        '',
        `<Tabs groupId="usage">`,
        `  <TabItem value="Node">`,
        '```ts',
        `${importPattern} from '${basePath}'`,
        '```',
        `  </TabItem>`,

        `  <TabItem value="Deno">`,
        '```ts',
        `${importPattern} from '${denoURL.toString()}'`,
        '```',
        `  </TabItem>`,

        `  <TabItem value="Browser">`,
        '```ts',
        `${importPattern} from '${browserURL.toString()}'`,
        '```',
        `  </TabItem>`,

        `</Tabs>`,
      ]
    }

    return [
      `import Tabs from '@theme/Tabs'`,
      `import TabItem from '@theme/TabItem'`,

      `# ${title}`,
      declaration.join('\n'),
    ].join('\n\n')
  })
}
