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

import { visit } from 'unist-util-visit'
import { runtimePattern, runtimeToTabLabel } from '../../common/runtime.mjs'

/**
 *
 * @param {import('unist').Node} node
 * @param {string} runtime
 * @returns
 */
const transformNode = (node, runtime) => {
  return [
    {
      type: 'jsx',
      value: `<TabItem value="${runtime}" label="${runtimeToTabLabel(runtime)}">`,
    },
    {
      type: node.type,
      lang: node.lang,
      value: node.value,
    },
    {
      type: 'jsx',
      value: '</TabItem>',
    },
  ]
}

/**
 *
 * @param {import('mdast').Code} node
 * @returns
 */
function matchRuntimeTag(node) {
  return node.type === 'code' && runtimePattern.exec(node.meta || '')
}

// const nodeForImport = {
//   type: 'import',
//   value: "import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';",
// }

export function polygotPlugin() {
  /**
   *
   * @param {import('mdast').Root} node
   * @returns
   */
  function visitor(node) {
    if (!Array.isArray(node.children)) return

    let index = 0
    const insertions = []

    while (index < node.children.length) {
      const child = node.children[index]
      const matches = matchRuntimeTag(child)

      if (matches) {
        const runtime = matches[1]
        const result = transformNode(child, runtime)
        insertions.push(...result)

        node.children.splice(index, 1, ...result)

        index += result.length
      } else {
        index += 1
      }
    }

    if (insertions.length) {
      const beforeFirstInsertion = node.children.indexOf(insertions[0])
      const afterLastInsertion = node.children.indexOf(insertions[insertions.length - 1]) + 2

      node.children.splice(beforeFirstInsertion, 0, {
        type: 'jsx',
        value: `\n<Tabs groupId="runtime">\n`,
      })

      node.children.splice(afterLastInsertion, 0, {
        type: 'jsx',
        value: '\n</Tabs>\n',
      })
    }
  }

  /**
   * @param {import('unist').Node} tree
   */
  function transform(tree) {
    visit(tree, ['root'], visitor)
  }

  return transform
}
