---
id: install
title: Install
sidebar_position: 0
sidebar_label: Quick Start
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

The Keywork library is framework agnostic, modular,
and compatible with Cloudflare Workers, Deno, and Node.js.

## Creating a new app from scratch

If you're using Cloudflare, or would like to start from a template,
checkout the [Keywork Starter Kit](https://github.com/sister-software/keywork-starter-kit).
The kit includes support for React, TypeScript, and ESBuild.

## Adding Keywork to your existing codebase

Keywork is often added to an existing web app when a developer wants to migrate
their deployment to a V8 Isolate runtime, such as Cloudflare Workers or Deno.

<Tabs groupId="npm">
  <TabItem value="yarn" label="Yarn">

Let's start by adding Keywork to your project via [Yarn](https://yarnpkg.com/):

```shell title="Run in the root of your project."
$ yarn add keywork
```

  </TabItem>

  <TabItem value="npm" label="NPM">

Let's start by adding Keywork to your project via NPM:

```shell title="Run in the root of your project."
$ npm install keywork
```

  </TabItem>

</Tabs>

### If your app uses React...

You'll need additional peer dependencies:

<Tabs>

  <TabItem value="npm" label="NPM">

```shell title="Run in the root of your project."
$ npm install --save react react-dom
```

  </TabItem>

  <TabItem value="yarn" label="Yarn">

```shell title="Run in the root of your project."
$ yarn add react react-dom
```

  </TabItem>
</Tabs>
