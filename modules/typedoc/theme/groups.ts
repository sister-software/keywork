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
import { ReflectionKind } from 'typedoc'

const PLURALS = {
  [ReflectionKind.Class]: 'Classes',
  [ReflectionKind.Property]: 'Properties',
  [ReflectionKind.Enum]: 'Enumerations',
  [ReflectionKind.EnumMember]: 'Enumeration members',
  [ReflectionKind.TypeAlias]: 'Type aliases',
}

export function getKindPlural(kind: ReflectionKind): string {
  if (kind in PLURALS) {
    return PLURALS[kind as keyof typeof PLURALS]
  } else {
    return getKindString(kind) + 's'
  }
}

function getKindString(kind: ReflectionKind): string {
  let str = ReflectionKind[kind]
  str = str.replace(/(.)([A-Z])/g, (_m, a, b) => a + ' ' + b.toLowerCase())
  return str
}
