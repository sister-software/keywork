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

import * as MDAST from 'mdast'
import * as Unist from 'unist'
import { visit } from 'unist-util-visit'
import { Runtime, runtimePattern, runtimeToTabLabel } from '../utils/index.js'

const transformNode = (node: any, runtime: Runtime): MDAST.Code[] => {
  return [
    {
      type: 'jsx' as any,
      value: `\n<TabItem value="${runtime}" label="${runtimeToTabLabel(runtime)}">\n`,
    },
    {
      type: node.type,
      lang: node.lang,
      value: node.value,
    },
    {
      type: 'jsx' as any,
      value: '\n</TabItem>\n',
    },
  ]
}

const isImport = (node: Unist.Node) => node.type === 'import'

function matchRuntimeTag(node: Unist.Node) {
  if (!node || node.type !== 'code') return null

  return ((node as any).meta || '').match(runtimePattern)
}

const nodeForImport: MDAST.Content = {
  type: 'import' as any,
  value: "\nimport Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n",
}

const insertImports = false

export function polygotPlugin() {
  /**
   *
   * @param {import('mdast').Root} node
   * @returns
   */
  function visitor(node: MDAST.Root) {
    let alreadyImported = false

    if (isImport(node) && (node as any).value.includes('@theme/Tabs')) {
      alreadyImported = true
    }

    if (!Array.isArray(node.children)) return

    let tabGroupInserted = false
    let indexOfCurrentTabGroup

    const initialChildren = node.children.slice()
    // Wrap the groups of code nodes in a tab group...
    for (let i = 0; i < initialChildren.length; i++) {
      const child = initialChildren[i]
      const siblingIndex = i + 1
      const sibling = initialChildren[siblingIndex]
      const childMatches = matchRuntimeTag(child)
      const siblingMatches = matchRuntimeTag(sibling)

      if (childMatches) {
        if (typeof indexOfCurrentTabGroup === 'undefined') {
          // console.log(`The first match of type "${child.type}" is at index "${i}"`)
          // console.log('Beginning tab group...')
          tabGroupInserted = true
          const childCurrentPosition = node.children.indexOf(child)

          if (childCurrentPosition === -1) {
            throw new Error(
              `Could not find child of type ${child.type} at index "${i}" with current position "${childCurrentPosition}"`
            )
          }

          node.children.splice(childCurrentPosition, 0, {
            type: 'jsx' as any,
            value: `\n<Tabs groupId="runtime">\n`,
          })

          indexOfCurrentTabGroup = childCurrentPosition + 1
        } else if (!siblingMatches && sibling) {
          // console.log(`The current match's sibling is a "${sibling.type}" and isn't does not match`)
          // console.log('Ending tab group...')

          const siblingCurrentPosition = node.children.indexOf(sibling)
          node.children.splice(siblingCurrentPosition, 0, {
            type: 'jsx' as any,
            value: '\n</Tabs>\n',
          })

          indexOfCurrentTabGroup = undefined
        } else if (i === initialChildren.length - 1 && typeof indexOfCurrentTabGroup !== 'undefined') {
          // console.log('The last match is a runtime tag, but the tab group is still open.')
          // console.log('Ending tab group...')

          node.children.push({
            type: 'jsx' as any,
            value: '\n</Tabs>\n',
          })

          indexOfCurrentTabGroup = undefined
        }
      }
    }

    if (typeof indexOfCurrentTabGroup !== 'undefined') {
      // console.log('A dangling tab group exists. Should of ended it...')
    }

    let index = 0

    // Wrap matching nodes with tab elements...
    while (index < node.children.length) {
      const child = node.children[index]
      const matches = matchRuntimeTag(child)

      if (matches) {
        const runtime = matches[1]
        const result = transformNode(child, runtime)

        node.children.splice(index, 1, ...result)

        index += result.length
      } else {
        index += 1
      }
    }

    if (insertImports && tabGroupInserted && !alreadyImported) {
      node.children.unshift(nodeForImport)
    }
  }

  function transform(tree: any) {
    visit(tree, ['root'], visitor)
  }

  return transform
}
