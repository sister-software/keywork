---
title: Overview
sidebar_label: Module Overview
tags: ['Module']
sidebar_position: 0
pagination_label: 'Module: Timers'
---

## Module Overview

Keywork includes promise-based utilities for working with the DOM.

### Browser

#### `waitUntilDOMReady`

Creates a promise that blocks until the DOM has loaded.

```ts
import { waitUntilDOMReady } from 'keywork/timers/browser'

await waitUntilDOMReady()
```

#### `requestAnimationFramePromise`

Promise wrapper around `requestAnimationFrame`

```ts
import { requestAnimationFrame } from 'keywork/timers/browser'

await requestAnimationFrame()
```
