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

export function headingClasses() {
  function visitor(node) {
    const lastChild = node.children[node.children.length - 1]
    if (lastChild && lastChild.type === 'text') {
      let string = lastChild.value.replace(/ +$/, '')
      const matched = string.match(/ {\.([^]+?)}$/)

      if (matched) {
        const className = matched[1]
        if (className.length) {
          if (!node.data) {
            node.data = {}
          }
          if (!node.data.hProperties) {
            node.data.hProperties = {}
          }
          node.data.className = node.data.hProperties.className = className

          string = string.substring(0, matched.index)
          lastChild.value = string
        }
      }
    }
  }

  function transform(tree) {
    visit(tree, ['heading'], visitor)
  }

  return transform
}
