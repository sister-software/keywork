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

import { hasProperty } from 'hast-util-has-property'
import { visit } from 'unist-util-visit'

export function relativeLinks(options) {
  if (!options || !options.domainRegex) {
    throw Error('Missing required "domainRegex" option')
  }

  function visitor(node) {
    if (hasProperty(node, 'href') && options.domainRegex.test(node.properties.href)) {
      node.properties.href = node.properties.href.replace(options.domainRegex, '/')
    } else if (options.domainRegex.test(node.url)) {
      node.url = node.url.replace(options.domainRegex, '/')
    }
  }

  function transform(tree) {
    visit(tree, ['link', 'linkReference', 'element'], visitor)
  }

  return transform
}
