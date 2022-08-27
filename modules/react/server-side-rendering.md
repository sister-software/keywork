---
id: server-side-rendering
title: React SSR in a Worker runtime
sidebar_position: 2
sidebar_label: Server Side Rendering
---

## How Keywork uses React to render HTML

When a route handler responds to a request with a React component,
Keywork automatically converts the content into a streamed response.

For example, consider this React Page component:

```tsx title=/shared/components/Page.tsx showLineNumbers
import React from 'react'

export interface PageProps {
  renderedAt: string
}

export const Page: React.FC<PageProps> = (props) => {
  const renderedDate = new Date(props.renderedAt)

  const showAlert = useCallback(() => {
    alert('I was rendered on the server!')
  }, [])

  return (
    <div>
      <h1>Hello from React</h1>
      <h1>Rendered at {renderedDate.toLocaleTimeString()}</h1>
      <button onClick={showAlert}>Click me!</button>
    </div>
  )
}
```

...And how the component is then rendered by `RequestRouter`:

```tsx title=worker/worker.tsx showLineNumbers
import React from 'react'
import { Page, PageProps } from '@local/shared/components/Page'
import { RequestRouter } from 'keywork/router'

export const router = new RequestRouter()

// highlight-start
router.get('/', () => {
  return <Page renderedDate={new Date()}>
})
// highlight-end
```

Finally, the browser receives the response with a full HTML document:

```html showLineNumbers
<!DOCTYPE html>
<html>
  <!-- <head .../> -->
  <body>
    <!-- highlight-start -->
    <div>
      <h1>Hello from React</h1>
      <h1>Rendered at 11:45:32 AM</h1>

      <button>Click me!</button>
    </div>
    <!-- highlight-end -->
  </body>
</html>
```

## Why hydration is necessary for dynamic React apps

However, if the React component has any dynamic behaviors, such as setting up event listeners,
or data fetching, the browser must perform an additional rendering step called "hydration."

Hydration is how React _revives_ the existing HTML markup sent by Keywork,
almost as if the components were actually rendered in the browser.

In the example above, our button rendered just fine.
But when clicked, the component doesn't invoke its `showAlert` callback as expected.

This is often where developers find themselves overburdened with complexity.
We need to hydrate the React components, _and_ provide the original `PageProps` passed
to the `Page` component. And if you're used to your React framework handling this for you,
like in Next.js, migrating your app to Cloudflare Workers may seem impossible.

Keywork does all the heavy lifting 😮‍💨

## Serializing our static props

Before rendering your React component, Keywork will serialize any props
passed as JSON, and inject them in the HTML response:

```html
<body>
  <!-- ... -->
  <script id=":KeyworkSSRPropsElement:" type="text/javascript">
    ;(function () {
      const encoded = '%7B%22renderedAt%22%3A%222022-07-05T19%3A18%3A36.320Z%22%7D'
      self[':KeyworkSSRProps:'] = JSON.parse(decodeURIComponent(encoded))
    })()
  </script>
</body>
```

:::warning
When a route handler responds to a request using a React component,
the props must be both serializable into JSON **and** deserialize back to their
original shape:

- Use `null` instead of undefined for optional values
- Avoid circular references

:::

## Putting it all together

With our props available, all that's left to do is hydrate the app:

```tsx title=/browser/src/main.tsx showLineNumbers
import { Page } from '@local/shared/components/Page'
import { KeyworkApp } from 'keywork/react/browser'
import { waitUntilDOMReady } from 'keywork/timers/browser'
import React from 'react'

waitUntilDOMReady().then(() => {
  const app = new KeyworkApp()

  // highlight-start
  return app.hydrate((staticProps) => (
    <React.StrictMode>
      <Page {...staticProps} />
    </React.StrictMode>
  ))
  // highlight-end
})
```
