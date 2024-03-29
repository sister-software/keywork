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

import { Deno } from '@deno/shim-deno'
import { Status } from '../errors/index.js'
import { JSONResponse, KeyworkHeaders } from '../http/index.js'
import { assertEquals, assertExists, assertObjectMatch, assertStringIncludes } from '../testing/index.js'
import { useParams } from '../uri/index.js'
import { RequestRouter } from './RequestRouter.js'
import type { RouteRequestHandler } from './RouteRequestHandler.js'

interface HelloResponseBody extends Record<PropertyKey, unknown> {
  url: string
  date: string
  message: string
}

Deno.test('Router receives requests', async () => {
  const app = new RequestRouter()

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

  const rootResponse = await app.fetch(new Request('http://localhost/'))
  assertEquals(await rootResponse.text(), `Hello from /`, 'Text body matches')

  assertEquals(
    rootResponse.headers.get('X-Powered-By'),
    KeyworkHeaders['X-Powered-By'],
    '"Powered by" header is present'
  )

  const JSONResponse = await app.fetch(new Request('http://localhost/hello.json'))
  assertObjectMatch(await JSONResponse.json(), jsonBody)
})

Deno.test('Router parses URL parameters', async () => {
  const app = new RequestRouter()

  // Declaring a route with URL params...
  interface ExampleParams {
    firstName: string
    lastName: string
  }

  app.get<ExampleParams>('/json/:firstName/:lastName', ({ params }) => {
    const body = { firstName: params.firstName, lastName: params.lastName }
    return new JSONResponse(body)
  })

  const rootResponse = await app.fetch(new Request('http://localhost/json/jessie/james'))
  const body: ExampleParams = await rootResponse.json()
  assertEquals(body, { firstName: 'jessie', lastName: 'james' }, 'Params are parsed')
})

Deno.test('Router renders JSX', async () => {
  const app = new RequestRouter({
    displayName: 'JSX Tester Router',
  })

  // Declaring a route that returns a React element...
  app.get('/', () => {
    return (
      <div>
        <h1>JSX Test</h1>
      </div>
    )
  })

  const response = await app.fetch(new Request('http://localhost/'))
  assertEquals(response.status, Status.OK)
  assertStringIncludes(await response.text(), `<div><h1>JSX Test</h1></div>`, 'Body includes rendered JSX')
})

Deno.test('Router uses match context', async () => {
  const app = new RequestRouter({
    displayName: 'JSX Match Context Tester Router',
  })

  interface ExampleParams {
    firstName: string
    lastName: string
  }

  const PageComponent: React.FC = () => {
    const { firstName, lastName } = useParams<ExampleParams>()
    const message = `Hello ${firstName} and ${lastName}`

    return (
      <div>
        <h1>{message}</h1>
      </div>
    )
  }

  // Declaring a route that returns a React element...
  app.get('/:firstName/:lastName', () => {
    return <PageComponent />
  })

  const response = await app.fetch(new Request('http://localhost/Coheed/Cambria'))
  assertEquals(response.status, Status.OK)
  assertStringIncludes(
    await response.text(),
    `<div><h1>Hello Coheed and Cambria</h1></div>`,
    'Body includes rendered JSX'
  )
})

Deno.test('Router supports middleware', async () => {
  const HelloWorldRouter = new RequestRouter({
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
  const app = new RequestRouter({
    displayName: 'Middleware Tester App',
    middleware: [
      // The example routes...
      HelloWorldRouter,
    ],
  })

  const simpleResponse = await app.fetch(new Request('http://localhost/'))
  assertEquals(simpleResponse.status, Status.OK)
  assertStringIncludes(await simpleResponse.text(), `<h1>Hello there!</h1>`, 'Body includes default content')

  const greeting = `Hello at ${new Date().toJSON()}`
  const url = new URL('http://localhost')
  url.searchParams.set('greeting', greeting)
  const responseWithQuery = await app.fetch(new Request(url))

  assertEquals(responseWithQuery.status, Status.OK)
  assertStringIncludes(await responseWithQuery.text(), `<h1>${greeting}</h1>`, 'Body includes query params')

  app.use('/hello', HelloWorldRouter)

  const nestedRequest = await app.fetch(new Request('http://localhost/hello/example-json'))
  assertEquals(nestedRequest.status, Status.OK, 'Nested request routes correctly')
  assertEquals(await nestedRequest.json(), { hello: 'world' }, 'Nested body includes content')
})

Deno.test('Router supports middleware as `RouteRequestHandler`', async () => {
  const app = new RequestRouter({
    displayName: 'Route Request Handler Tester',
  })

  const addTestingHeaderMiddleware: RouteRequestHandler = async (event, next) => {
    const response = await next()
    if (!response) return response

    response.headers.set('X-Test-Header', 'Added by middleware')

    return response
  }

  app.use(addTestingHeaderMiddleware)
  app.get('/', () => 'Hello from out of the box!')

  const response = await app.fetch(new Request('http://localhost/'))

  assertEquals(response.headers.get('X-Test-Header'), 'Added by middleware', 'Header was added')
})
