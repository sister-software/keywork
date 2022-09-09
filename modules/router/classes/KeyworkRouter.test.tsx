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

import { assertEquals, assertExists, assertObjectMatch, assertStringIncludes } from 'deno/testing/asserts'
import React, { useMemo, ValidationMap, WeakValidationMap } from 'https://esm.sh/react@18.2.0'
import { Status } from '../../errors/mod.ts'
import { JSONResponse } from '../../http/mod.ts'
import { findRoutesMatchingURL, RequestHandler } from '../mod.ts'
import { KeyworkHeaders, RequestRouter } from './RequestRouter.ts'

interface HelloResponseBody extends Record<PropertyKey, unknown> {
  url: string
  date: string
  message: string
}

interface JSXCompatibleResponse extends ResponseInit {
  body?: BodyInit | null
}

/**
 * A JSX component that represents an instance of the `Response` class.
 */
const JSXCompatibleResponse: Keywork.RC<JSXCompatibleResponse> = ({ body, ...responseInit }) => {
  const response = useMemo(() => {
    return new Response(body, responseInit)
  }, [body, responseInit])

  return response
}

Deno.test({
  name: 'Router receives requests',
  fn: async () => {
    const app = new RequestRouter({
      displayName: 'Test Router #1',
      debug: false,
    })

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

    assertEquals(routesViaGET.size, 2, 'Multiple routes have been defined for GET')
    assertEquals(findRoutesMatchingURL(routesViaGET, new URL('http://localhost/')).length, 1, 'Root route exists')
    assertExists(findRoutesMatchingURL(routesViaGET, new URL('http://localhost/hello.json')), 'JSON route exists')

    const routesViaPOST = app.readMethodRoutes('post')
    assertEquals(routesViaPOST.size, 0, 'No routes have been defined for POST')
    assertEquals(findRoutesMatchingURL(routesViaPOST, '/').length, 0, 'Root route only exists on GET')
    assertEquals(findRoutesMatchingURL(routesViaPOST, '/hello.json').length, 0, 'JSON route only exists on GET')

    const rootResponse = await app.fetch(new Request('http://localhost/'))
    const textBody = await rootResponse.text()
    console.debug('>>>>', rootResponse)
    assertEquals(textBody, `Hello from /`, 'Text body matches')

    const JSONResponse = await app.fetch(new Request('http://localhost/hello.json'))
    assertObjectMatch(await JSONResponse.json(), jsonBody)
  },
})

Deno.test({
  name: 'Router allows middleware to modify headers',
  fn: async () => {
    const app = new RequestRouter()

    app.get('/', () => `Hello from header test`)

    const response = await app.fetch(new Request('http://localhost/'))

    assertEquals(
      //
      response.headers.get('X-Powered-By'),
      KeyworkHeaders['X-Powered-By'],
      '"Powered by" header is present'
    )
  },
})

Deno.test({
  name: 'Router parses URL parameters',
  fn: async () => {
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
  },
})

Deno.test({
  name: 'Router renders JSX',
  fn: async () => {
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
  },
})

Deno.test({
  name: 'Router supports middleware',
  fn: async () => {
    const HelloWorldRouter = new RequestRouter({
      displayName: 'Hello World Router',
      debug: false,
    })

    // Declaring a route that returns a React element...
    HelloWorldRouter.get('/', async ({ request }) => {
      console.log('Hello World!')
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

    // app.get('*', HelloWorldRouter)
    // app.use('/hello', HelloWorldRouter)

    const simpleResponse = await app.fetch(new Request('http://localhost/'))
    assertEquals(simpleResponse.status, Status.OK)
    assertStringIncludes(await simpleResponse.text(), `<h1>Hello there!</h1>`, 'Body includes default content')

    const greeting = `Hello at ${new Date().toJSON()}`
    const url = new URL('http://localhost')
    url.searchParams.set('greeting', greeting)
    const responseWithQuery = await app.fetch(new Request(url))

    assertEquals(responseWithQuery.status, Status.OK)
    assertStringIncludes(await responseWithQuery.text(), `<h1>${greeting}</h1>`, 'Body includes query params')

    // const nestedRequest = await app.fetch(new Request('http://localhost/hello/example-json'))
    // assertEquals(nestedRequest.status, Status.OK, 'Nested request routes correctly')
    // assertEquals(await nestedRequest.json(), { hello: 'world' }, 'Nested body includes content')
  },
})

Deno.test({
  name: 'Router supports middleware as `RequestHandler`',
  fn: async () => {
    const app = new RequestRouter({
      displayName: 'Route Request Handler Tester',
    })

    const addTestingHeaderMiddleware: RequestHandler = async (event) => {
      const response = await next()
      if (!response) return response

      response.headers.set('X-Test-Header', 'Added by middleware')

      return response
    }

    app.use(addTestingHeaderMiddleware)
    app.get('/', () => 'Hello from out of the box!')

    const response = await app.fetch(new Request('http://localhost/'))

    assertEquals(response.headers.get('X-Test-Header'), 'Added by middleware', 'Header was added')
  },
})
