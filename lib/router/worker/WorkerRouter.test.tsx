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

import { Status } from 'deno/http/http_status'
import { assertEquals, assertExists, assertObjectMatch, assertStringIncludes } from 'deno/testing/asserts'
import { WorkerRouter } from 'keywork/router/worker'
import HTTP from 'keywork/platform/http'
import { JSONResponse } from 'keywork/response'
import React from 'react'

interface HelloResponseBody extends Record<PropertyKey, unknown> {
  url: string
  date: string
  message: string
}

Deno.test('Router receives requests', async () => {
  const app = new WorkerRouter()

  app.get('/', (event) => {
    const url = new URL(event.request.url)

    return `Hello from ${url.pathname}`
  })

  const jsonBody: HelloResponseBody = {
    url: '___',
    date: new Date().toJSON(),
    message: 'Keywork rocks!',
  }

  app.get('/hello.json', (event) => {
    const url = new URL(event.request.url)
    jsonBody.url = url.toString()

    return jsonBody
  })

  const routesViaGET = app.readMethodRoutes('get')
  assertEquals(routesViaGET.length, 2, 'Multiple routes have been defined for GET')
  assertEquals(app.match(routesViaGET, '/').length, 1, 'Root route exists')
  assertExists(app.match(routesViaGET, '/hello.json'), 'JSON route exists')

  const routesViaPOST = app.readMethodRoutes('post')
  assertEquals(routesViaPOST.length, 0, 'No routes have been defined for POST')
  assertEquals(app.match(routesViaPOST, '/').length, 0, 'Root route only exists on GET')
  assertEquals(app.match(routesViaPOST, '/hello.json').length, 0, 'JSON route only exists on GET')

  const rootResponse = await app.fetch(new HTTP.Request('http://localhost/'))
  assertEquals(await rootResponse.text(), `Hello from /`)

  const JSONResponse = await app.fetch(new HTTP.Request('http://localhost/hello.json'))
  assertObjectMatch(await JSONResponse.json(), jsonBody)
})

Deno.test('Router parses URL parameters', async () => {
  const app = new WorkerRouter()

  // Declaring a route with URL params...
  interface ExampleParams {
    firstName: string
    lastName: string
  }

  app.get<ExampleParams>('/json/:firstName/:lastName', ({ params }) => {
    const body = { firstName: params.firstName, lastName: params.lastName }
    return new JSONResponse(body)
  })

  const rootResponse = await app.fetch(new HTTP.Request('http://localhost/json/jessie/james'))
  const body: ExampleParams = await rootResponse.json()
  assertEquals(body, { firstName: 'jessie', lastName: 'james' }, 'Params are parsed')
})

Deno.test('Router supports middleware', async () => {
  const HelloWorldRouter = new WorkerRouter({
    displayName: 'Hello World Router',
  })

  // Declaring a route that returns a React element...
  HelloWorldRouter.get('/', async ({ request }) => {
    const url = new URL(request.url)
    // Reading some optional static props from the URL search params...
    const staticProps = {
      greeting: url.searchParams.get('greeting') || 'Hello there!',
    }

    return <h1>{staticProps.greeting}</h1>
  })

  // Declaring a route that returns JSON...
  HelloWorldRouter.get('/example-json', () => {
    return { hello: 'world' }
  })

  // Create a router to receive all incoming requests...
  const app = new WorkerRouter({
    displayName: 'Middleware Tester App',
    middleware: [
      // The example routes...
      HelloWorldRouter,
    ],
  })

  const rootResponse = await app.fetch(new HTTP.Request('http://localhost/'))
  assertEquals(rootResponse.status, Status.OK)
  assertStringIncludes(await rootResponse.text(), `<h1>Hello there!</h1>`, 'Body includes default content')
})
