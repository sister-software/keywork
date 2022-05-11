export type PrettyJSON = (...args: Parameters<typeof JSON.stringify>) => string

export const prettyJSON: PrettyJSON = (value, replacer = null, space = 2) => {
  return JSON.stringify(value, replacer, space)
}
