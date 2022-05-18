export function numberInRange(given: number, minimum = 0, maximum = Infinity) {
  return Math.max(Math.min(given, maximum), minimum)
}

/**
 * A function for converting hex <-> dec w/o loss of precision.
 * By Dan Vanderkam http://www.danvk.org/hex2dec.html
 */

// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
function add(x: number[], y: number[], base: number) {
  const z = []
  const n = Math.max(x.length, y.length)
  let carry = 0
  let i = 0
  while (i < n || carry) {
    const xi = i < x.length ? x[i]! : 0
    const yi = i < y.length ? y[i]! : 0
    const zi = carry + xi + yi
    z.push(zi % base)
    carry = Math.floor(zi / base)
    i++
  }
  return z
}

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num: number, x: number[], base: number) {
  if (num < 0) throw new Error('Num must be greater than 0')
  if (num == 0) return []

  let result: number[] = []
  let power = x
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (num & 1) {
      result = add(result, power, base)
    }
    num = num >> 1
    if (num === 0) break
    power = add(power, power, base)
  }

  return result
}

function parseToDigitsArray(str: string, base: number) {
  const digits = str.split('')
  const ary = []
  for (let i = digits.length - 1; i >= 0; i--) {
    const n = parseInt(digits[i]!, base)
    if (isNaN(n)) return null
    ary.push(n)
  }
  return ary
}

function convertBase(str: string, fromBase: number, toBase: number): string {
  const digits = parseToDigitsArray(str, fromBase)
  if (digits === null) throw new Error('String must include digits')

  let outArray: number[] = []
  let power: number[] = [1]
  for (let i = 0; i < digits.length; i++) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(outArray, multiplyByNumber(digits[i]!, power, toBase), toBase)
    }
    power = multiplyByNumber(fromBase, power, toBase)
  }

  let out = ''
  for (let i = outArray.length - 1; i >= 0; i--) {
    out += outArray[i]!.toString(toBase)
  }
  return out
}

export function hexToDec(hexStr: string): string {
  if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2)
  hexStr = hexStr.toLowerCase()
  return convertBase(hexStr, 16, 10)
}
