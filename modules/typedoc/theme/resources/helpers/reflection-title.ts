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
import dashify from 'dashify'
import Handlebars from 'handlebars'
import * as path from 'path'
import { PageEvent, ReflectionKind, SignatureReflection } from 'typedoc'
import { runtimeToTabLabel } from '../../../../../common/runtime.mjs'
import { MarkdownTheme } from '../../theme.ts'
import { escapeChars } from '../../utils.ts'

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper('reflectionTitle', function <
    T extends SignatureReflection
  >(this: PageEvent<T>, shouldEscape = true) {
    const { model } = this
    let title: string
    let declaration: string[] = []
    const kindString = model.kindString || 'Reflection'

    if (model && this.url !== this.project.url) {
      title = `${kindString}: `
    }
    if (this.url === this.project.url) {
      title = theme.indexTitle || this.project.name
    } else {
      title = shouldEscape ? escapeChars(model.name) : model.name
    }

    if (model.sources?.[0]) {
      const source = model.sources[0]
      const basePath = path.posix.join('keywork', path.dirname(source.fileName))
      const browserURL = new URL(basePath, 'https://esm.sh/')
      const denoURL = new URL(`/x/keywork/${source.fileName}`, 'https://deno.land')
      const isModule = model.kindOf(ReflectionKind.Module)
      let importName: string
      let browserUsage: string
      let importPattern: string

      if (isModule || model.originalName === 'default') {
        if (model.name === model.originalName || model.originalName === 'default') {
          importName = 'mod'
        } else {
          importName = model.name
        }

        browserUsage = `let ${importName} = await import('${browserURL.toString()}')`
        importPattern = `import * as ${importName}`
      } else {
        importName = model.originalName
        importPattern = `import { ${model.originalName} }`
        browserUsage = `let { ${importName} } = await import('${browserURL.toString()}')`
      }
      const browserCompatible = model.kindOf([
        ReflectionKind.Module,
        ReflectionKind.Class,
        ReflectionKind.Function,
        ReflectionKind.Variable,
      ])

      declaration = [
        ...(browserCompatible
          ? [
              '',
              '<head>',
              `  <script async defer>`,
              `    console.info("It looks like you're reading about a Keywork API");`,
              `    console.info("You can try it in the browser like this!");`,
              `    console.info(decodeURIComponent("${encodeURIComponent(browserUsage)}"));`,
              `  </script>`,
              '</head>',
            ]
          : []),
        '',
        `<Tabs groupId="runtime">`,
        `  <TabItem value="Node" label="${runtimeToTabLabel('node')}">`,
        '',
        '```ts',
        `${importPattern} from '${basePath}'`,
        '```',
        '',
        `  </TabItem>`,

        `  <TabItem value="Deno" label="${runtimeToTabLabel('deno')}">`,
        '',
        '```ts',
        `${importPattern} from '${denoURL.toString()}'`,
        '```',
        '',
        `  </TabItem>`,

        ...(browserCompatible
          ? [
              `  <TabItem value="Browser" label="${runtimeToTabLabel('browser')}">`,
              '',
              '```ts',
              `${importPattern} from '${browserURL.toString()}'`,
              '```',
              '',
              `  </TabItem>`,
            ]
          : []),
        `</Tabs>`,
        '',
      ]
    }

    return [
      `import Tabs from '@theme/Tabs'`,
      `import TabItem from '@theme/TabItem'`,

      `# ${title} {.kind-${dashify(kindString)}}`,
      declaration.join('\n'),
    ].join('\n\n')
  })
}
