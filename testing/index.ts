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
export function assertEquals(actual: any, expected: any, message = 'Assertion failed') {
  if (actual !== expected) {
    throw new Error(message)
  }
}

export function assert(actual: any, message = 'Assertion failed') {
  if (!actual) {
    throw new Error(message)
  }
}

export function assertExists(actual: any, message = 'Value does not exist') {
  if (actual === undefined || actual === null) {
    throw new Error(message)
  }
}

export function assertObjectMatch(actual: any, expected: any, message = 'Objects do not match') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message)
  }
}

export function assertStringIncludes(actual: string, expected: string, message = 'String does not include') {
  if (!actual.includes(expected)) {
    throw new Error(message)
  }
}
