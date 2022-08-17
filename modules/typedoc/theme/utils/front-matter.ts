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
import { PageEvent } from 'typedoc'

export interface FrontMatterVars {
  [key: string]: string | number | boolean
}

/**
 * Prepends YAML block to a string
 * @param contents - the string to prepend
 * @param vars - object of required front matter variables
 */
export const prependYAML = (contents: string, vars: FrontMatterVars) => {
  return contents.replace(/^/, toYAML(vars) + '\n\n').replace(/[\r\n]{3,}/g, '\n\n')
}

/**
 * Returns the page title as rendered in the document h1(# title)
 * @param page
 */
export const getPageTitle = (page: PageEvent<any>) => {
  return Handlebars.helpers.reflectionTitle.call(page, false)
}

/**
 * Converts YAML object to a YAML string
 * @param vars
 */
const toYAML = (vars: FrontMatterVars) => {
  const yaml = `---
${Object.entries(vars)
  .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${escapeString(value)}"` : value}`)
  .join('\n')}
---`
  return yaml
}

// prettier-ignore
const escapeString=(str: string) => str.replace(/"/g, '\\"');
