---
id: new-app
title: Creating a new React app
sidebar_position: 3
sidebar_label: Creating a new app
---

[Create React App](https://create-react-app.dev/docs/getting-started) and TypeScript

# Installing our project dependencies

```shell
mkdir keywork-example-react-esbuild
cd keywork-example-react-esbuild

yarn init
```

```shell
yarn add react react-dom
yarn add --dev esbuild typescript wrangler @types/react @types/react-dom @cloudflare/kv-asset-handler
```

```shell
mkdir -p src/browser
```
