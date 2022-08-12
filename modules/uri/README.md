---
title: URI
sidebar_label: Module Overview
tags: ['module']
sidebar_position: 0
pagination_label: 'Module: URI'
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

## URL Pattern API

Keywork uses JavaScript's built-in [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
to create pattern matchers.
The syntax is based on [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
Wildcards, named capture groups, regular groups, and group modifiers are all supported.

URL patterns can be matched against full URLs, or individual URL components:

```ts title="Matching URL pathname pattern."
const pattern = new URLPattern({ pathname: '/users/:user' })
const match = pattern.exec('/users/jessie')

console.log(match.pathname.groups.user) // jessie
```

```ts title="Matching a full URL pattern."
const pattern = new URLPattern('https://example.com/books/:id')
console.log(pattern.test('https://example.com/books/123')) // true
console.log(pattern.test('https://keywork.app/books/123')) // false
```

```ts title="Matching URL pathname pattern with a base URL"
const pattern = new URLPattern('/:article', 'https://blog.example.com')

console.log(pattern.test('https://blog.example.com/article')) // true
console.log(pattern.test('https://blog.example.com/article/123')) // false
```

### Peer Dependencies

Support for the URL Pattern API varies across [browser runtimes](https://caniuse.com/mdn-api_urlpattern).
You may need a polyfill if your app uses a runtime that hasn't yet added [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) class.

<Tabs groupId="node-install">
  <TabItem value="yarn" label="Yarn">

```shell title="Run in the root of your project."
$ yarn add urlpattern-polyfill
```

  </TabItem>

  <TabItem value="npm" label="NPM">

```shell title="Run in the root of your project."
$ npm install --save urlpattern-polyfill
```

  </TabItem>
</Tabs>

## Related Entries

- [Keywork Router](/modules/router)

## External Resources

- [URL Pattern API via MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
