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

import { DeclarationReflection, ParameterReflection, ReflectionKind, SignatureReflection } from 'typedoc'

export function formatContents(contents: string) {
  return (
    contents
      .replace(/[\r\n]{3,}/g, '\n\n')
      .replace(/!spaces/g, '')
      .replace(/^\s+|\s+$/g, '') + '\n'
  )
}

export function escapeChars(str: string) {
  return str
}

export function memberSymbol(reflection: DeclarationReflection | ParameterReflection | SignatureReflection) {
  const isStatic = reflection.flags && reflection.flags.isStatic

  if (reflection.kind === ReflectionKind.CallSignature) {
    return '▸'
  }
  if (reflection.kind === ReflectionKind.TypeAlias) {
    return 'Ƭ'
  }
  if (reflection.kind === ReflectionKind.ObjectLiteral) {
    return '▪'
  }
  if (reflection.kind === ReflectionKind.Property && isStatic) {
    return '▪'
  }

  return '•'
}

export function spaces(length: number) {
  return `!spaces${[...Array(length)].map(() => ' ').join('')}`
}

export function stripComments(str: string) {
  return str
    .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/g, ' ')
    .replace(/\n/g, '')
    .replace(/^\s+|\s+$|(\s)+/g, '$1')
}

export function stripLineBreaks(str: string) {
  return str ? str.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ').trim() : ''
}

export function camelToTitleCase(text: string) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).replace(/[a-z][A-Z]/g, (x) => `${x[0]} ${x[1]}`)
}
