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

/**
 * @see {@linkcode ImmutableMap}
 *
 * @internal
 */
export type ImmutableMapLike<K, V> = Omit<Map<K, V>, 'set' | 'clear' | 'delete'>

interface ImmutableMapConstructor {
  new (): ImmutableMapLike<any, any>
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): ImmutableMapLike<K, V>
  readonly prototype: ImmutableMapLike<any, any>
}

const NativeMap = Map as ImmutableMapConstructor

/**
 * A variant of the native Map class, constructed from an array of key-value pairs.
 *
 * This is useful when you want to create a map from a list of key-value pairs but
 * want to avoid type-checking when getting values from the map.
 */
export class ImmutableMap<K, V> extends NativeMap<K, V> {
  public override get = (key: K): V => {
    if (!super.has(key)) {
      throw new Error(`Key ${key} not found in readonly map.`)
    }

    return super.get(key)!
  }

  protected clear(): void {
    throw new Error('Attempted to invoke `clear` on readonly Map.')
  }

  protected delete(_key: K): boolean {
    throw new Error('Attempted to invoke `delete` on readonly Map.')
  }
}
