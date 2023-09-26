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
import { runtimeToTabLabel } from '@keywork/docgen/runtime'
import * as path from 'node:path'
import { Reflection, ReflectionKind } from 'typedoc'

type Runtimes = 'node' | 'deno' | 'cloudflare' | 'browser'
const runtimeTabOrder: Runtimes[] = ['node', 'deno', 'cloudflare', 'browser']
type ImportStyle = 'wildcard' | 'named'

interface ParsedModel {
  title: string
  kindString: string
  isModule: boolean
  importDeclaration: string
  importStyle: ImportStyle
  importName: string
  browserCompatible: boolean
  basePath: string
}

export function parseModel<T extends Reflection>(model: T): ParsedModel {
  let title: string
  const kindString = model.kindString || 'Reflection'
  let importDeclaration: string
  let importName: string
  let importStyle: ImportStyle

  const isModule = model.kindOf(ReflectionKind.Module)
  const browserCompatible = isModelBrowserCompatible(model)

  const source = model.sources?.[0]
  const basePath = source ? path.posix.join('keywork', path.dirname(source.fileName)) : model.getFullName('/')

  if (isModule || model.originalName === 'default') {
    if (model.name === model.originalName || model.originalName === 'default') {
      importName = 'mod'
      title = model.getFullName('/')
    } else {
      importName = model.name.split('#').pop()!
      title = importName
    }
    importDeclaration = `import * as ${importName}`
    importStyle = 'wildcard'
  } else {
    importName = model.originalName
    importDeclaration = `import { ${importName} }`
    title = importName
    importStyle = 'named'
  }

  return {
    isModule,
    title,
    kindString,
    importName,
    importDeclaration,
    importStyle,
    browserCompatible,
    basePath,
  }
}

export function createUsageMap({
  browserCompatible,
  importName,
  importStyle,
  importDeclaration,
  basePath,
}: ParsedModel) {
  const denoURL = new URL(`/x/${basePath}`, 'https://deno.land')

  const usageByRuntime = new Map<Runtimes, string>()

  usageByRuntime.set('deno', `${importDeclaration} from '${denoURL.toString()}'`)
  usageByRuntime.set('node', `${importDeclaration} from '${basePath}'`)

  if (browserCompatible) {
    const browserURL = new URL(basePath, 'https://esm.sh/')

    if (importStyle === 'wildcard') {
      usageByRuntime.set('browser', `let ${importName} = await import('${browserURL.toString()}')`)
    } else {
      usageByRuntime.set('browser', `let { ${importName} } = await import('${browserURL.toString()}')`)
    }
  }

  return usageByRuntime
}

export const isModelBrowserCompatible = (model: Reflection) => {
  return model.kindOf([ReflectionKind.Module, ReflectionKind.Class, ReflectionKind.Function, ReflectionKind.Variable])
}

export function renderUsageTabs(usageByRuntime: Map<Runtimes, string>) {
  const declaration: string[] = [
    '',
    `import Tabs from '@theme/Tabs'`,
    `import TabItem from '@theme/TabItem'`,
    '',
    `<Tabs groupId="runtime">`,
  ]

  for (const runtime of runtimeTabOrder) {
    const usage = usageByRuntime.get(runtime)
    if (!usage) continue

    declaration.push(
      '',
      `  <TabItem value="${runtime}" label="${runtimeToTabLabel(runtime)}">`,
      '',
      '```ts',
      usage,
      '```',
      '',
      `  </TabItem>`
    )
  }

  declaration.push(`</Tabs>`, '')

  return declaration.join('\n')
}

export function renderBrowserDemo(browserUsage: string) {
  return [
    '',
    '<head>',
    `  <script async defer>`,
    `    console.info("It looks like you're reading about a Keywork API");`,
    `    console.info("You can try it in the browser like this!");`,
    `    console.info(decodeURIComponent("${encodeURIComponent(browserUsage)}"));`,
    `  </script>`,
    '</head>',
  ].join('\n')
}
