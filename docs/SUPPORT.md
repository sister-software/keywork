---
title: Help & Support
id: help
slug: help
---

Keywork is a fast-growing project, and development often outpaces our documentation.

In case of problems or any further questions, please check [our documentation](https://keywork.app), or [open an issue](https://github.com/nirrius/keywork/issues/new).
We always appreciate helpful tips and support for the project.

## Asking Questions

If you have question that would resource to others searching for help,
we recommend posting it on our [discussion forum](https://github.com/nirrius/keywork/discussions).

The active community and Keywork maintainers will be eager to assist you.

## Debugging & Troubleshooting Techniques

Use a `try/catch` block around where you suspect an exception may be occurring.
Logging the exception gives us a clue as to the reasons for error,
while additionally concealing any potentially sensitive information from the client.

Finally, return an `ErrorResponse` to help your users understand the reason for the error.

### Remember, V8 is not Node

The V8 Isolates runtime uses a JavaScript that is more like a web browser than Node.
Node-exclusive patterns, such as `process.env` and `require('path')` are not compatible unless replaced during build time with a polyfill.

![Illustration of JavaScript runtimes](/img/serverless-circle.webp)

#### That looks terrifying! 😱

Keywork is built to minimize the differences between runtimes, and guide developers
using their existing knowledge of the web. However, there are limits to pursuing this goal:

- Built-in Node modules may have browser standard analogues and can be used instead.
- Modules such as `fs` don’t apply to the duties of a Worker and should not be used.
- Modules that use native C extensions such as `libsass` will generally be incompatible with V8 Isolates.

Additionally, browser-specific APIs are not available, such as `document` and `window`.

## Cloudflare Workers

While Keywork routers will do their best to catch exceptions while handling,
some errors may occur outside of your control, from within the Cloudflare Workers runtime.
Uncaught exceptions will automatically restart your worker,
usually with a small performance penalty while the runtime.

If you're using _Cloudflare Workers_ rather than _Cloudflare Pages_, you'll have access to additional details
in your Worker's logs from the Cloudflare Dashboard.

### Error 1101: Worker threw a JavaScript exception

This likely means that one of your Keywork routers is either not returning a valid response,
or is attempting to use a JavaScript API that isn't supported by the runtime.

Both Cloudflare Workers and Cloudflare Pages may differ from the official spec when using Web Streams.
You may need a [polyfill for `ReadableStream`](../modules/polyfills/worker/ReadableStream/).

### Error: 1102 Worker exceeded CPU time limit

Worker CPU time is [capped at various limits](https://developers.cloudflare.com/workers/platform/limits/#cpu-runtime) depending on your plan, usage model, and Worker type.

### Error: 1042 Worker tried to fetch from another Worker on the same zone, which is unsupported

A Worker may only make a fetch request to another Worker on the same zone, if and only if,
the request is made via a [service binding](https://developers.cloudflare.com/workers/platform/bindings/about-service-bindings/).

### Error: 1015 Your client IP is being rate limited

Cloudflare is rate-limiting you, and has temporarily blocked from connecting for a short time.

### Error: 1027 Worker exceeded free tier daily request limit

[See daily request limits ›](https://developers.cloudflare.com/workers/platform/limits/#daily-request)

## Additional Support

Keywork is maintained by team that depends on your support to remain active and thriving.
If you or your team needs expedited support, we offer commercial licenses for organizations of all sizes.
