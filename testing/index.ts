export function assertEquals(actual: any, expected: any, message: string = 'Assertion failed') {
  if (actual !== expected) {
    throw new Error(message)
  }
}

export function assert(actual: any, message: string = 'Assertion failed') {
  if (!actual) {
    throw new Error(message)
  }
}

export function assertExists(actual: any, message: string = 'Value does not exist') {
  if (actual === undefined || actual === null) {
    throw new Error(message)
  }
}

export function assertObjectMatch(actual: any, expected: any, message: string = 'Objects do not match') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message)
  }
}

export function assertStringIncludes(actual: string, expected: string, message: string = 'String does not include') {
  if (!actual.includes(expected)) {
    throw new Error(message)
  }
}
