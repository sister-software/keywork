---
title: Help & Support
id: help
slug: help
---

import { PopupButton } from '@typeform/embed-react'

Keywork is a fast-growing project, and development often outpaces our documentation.

In case of problems or any further questions, please check [our documentation](https://keywork.app), or [open an issue](https://github.com/nirrius/keywork/issues/new).
We always appreciate helpful tips and support for the project.

## Asking Questions

If you have question that would resource to others searching for help,
we recommend posting it on our [discussion forum](https://github.com/nirrius/keywork/discussions).

The active community and Keywork maintainers will be eager to assist you.

## Debugging

Remember, the V8 Isolates runtime uses a JavaScript that is more like a web browser than Node.
Node-exclusive patterns, such as `process.env` and `require('path')` are not compatible unless replaced during build time with a polyfill.

![Illustration of JavaScript runtimes](/img/serverless-circle.webp)

- Built-in Node modules may have browser standard analogues and can be used instead.
- Modules such as `fs` don’t apply to the duties of a Worker and should not be used.
- Modules that use native C extensions such as `libsass` will generally be incompatible with V8 Isolates.

## Additional Support

Keywork is maintained by team that depends on your support to remain active and thriving.
If you or your team needs expedited support, we offer commercial licenses for organizations of all sizes.

<PopupButton id="rTHsvoxn" className="button button--primary">Contact us about commercial use</PopupButton>
