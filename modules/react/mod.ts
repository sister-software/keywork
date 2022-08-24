/**
 * While optional, Keywork uses React as its primary HTML templating engine.
 *
 * ### Peer Dependencies
 *
 * If you haven't already, make sure to add the React peer dependencies:
 *
 * <Tabs groupId="npm">
 *   <TabItem value="yarn" label="Yarn">
 *
 * ```shell title="Run in the root of your project."
 * $ yarn add react react-dom
 * ```
 *
 *   </TabItem>
 *
 *   <TabItem value="npm" label="NPM">
 *
 * ```shell title="Run in the root of your project."
 * $ npm install --save react react-dom
 * ```
 *
 *   </TabItem>
 *
 *   <TabItem value="deno" label="Deno">
 *
 * [Import Maps](https://deno.land/manual/node/import_maps#using-import-maps)
 * are recommended to avoid long import URLs:
 *
 * ```json title="./your-project/import_map.json"
 * {
 *   "imports": {
 *     "react": "https://esm.sh/react@18.2.0",
 *     "react-dom": "https://esm.sh/react-dom@18.2.0",
 *     "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
 *     "react-dom/server": "https://esm.sh/react-dom@18.2.0/server",
 *     "react-dom/server.browser": "https://esm.sh/react-dom@18.2.0/server.browser",
 *     "react/jsx-runtime": "https://esm.sh/react/jsx-runtime"
 *   }
 * }
 * ```
 *
 *   </TabItem>
 * </Tabs>
 *
 * ## Usage
 *
 * Route handlers defined on an instance of {@link Keywork#Router.KeyworkRouter `KeyworkRouter`} can return a React component,
 * Keywork automatically converts the content into a streamed response.
 *
 * ```tsx
 * import { KeyworkRouter } from 'keywork/router'
 *
 * const app = new KeyworkRouter()
 *
 * app.get('/', () => <h1>Hello from Keywork! 👋</h1>)
 *
 * interface GreetParams {
 *   firstName: string
 * }
 *
 * app.get('/greet/:firstName', ({ params }) => {
 *   return (
 *     <div>
 *       <h1>Hello there! {params.firstName}</h1>
 *     </div>
 *   )
 * })
 *
 * export default app
 * ```
 * @packageDocumentation
 * @module Keywork#React
 *
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
/* eslint-disable header/header */

export * from './components/mod.ts'
export * from './functions/mod.ts'
export * from './interfaces/mod.ts'
export * from './variables/globalScopeSSRKey.ts'
