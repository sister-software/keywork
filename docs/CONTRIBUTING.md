---
title: Contributing to Keywork
sidebar_label: Community
id: contributing
---

Keywork is made possible through the countless contributions of the open-source community.
There are many ways in which you can contribute to the project.

The goal of this document is to provide a high-level overview of how you can get involved.

## Providing Feedback

If you find issues with the documentation, or have suggestions on how the project in general,
please [file an issue on GitHub](https://github.com/nirrius/keywork/issues).

Thank you for your patience 💕

## Reporting Issues

Have you identified a reproducible problem in Keywork?
Have a feature request? We want to hear about it!
Here's how you can report your issue as effectively as possible.

### Look For an Existing Issue

Before you create a new issue, please do a search in [open issues](https://github.com/microsoft/vscode/issues) to see if the issue or feature request has already been filed.

Be sure to scan through the [most popular](https://github.com/nirrius/keywork/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc) feature requests.

If you find your issue already exists, make relevant comments and add your [reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments). Use a reaction in place of a "+1" comment:

- 👍 - upvote
- 👎 - downvote

If you cannot find an existing issue that describes your bug or feature,
create a new issue using the guidelines below.

### Writing Good Bug Reports and Feature Requests

File a single issue per problem and feature request.
Do not enumerate multiple bugs or feature requests in the same issue.

Do not add your issue as a comment to an existing issue unless it's for the identical input.
Many issues look similar but have different causes.

The more information you can provide, the more likely someone will be successful at reproducing the issue and finding a fix.

Please include the following with each issue:

- Version of Keywork
- Your app's runtime (Cloudflare Workers/Pages, Deno, Node, Browser, etc)
- Reproducible steps (1... 2... 3...) that cause the issue
- What you expected to see, versus what you actually saw
- Images, animations, or a link to a video showing the issue occurring
- A code snippet that demonstrates the issue or a link to a code repository the developers can easily pull down to recreate the issue locally
  - **Note:** Because the developers need to copy and paste the code snippet, including a code snippet as a media file (i.e. .gif) is not sufficient.
- Errors from either your server, or from the browser's Dev Tools Console (open from the menu: Help > Toggle Developer Tools)

### Final Checklist

Please remember to do the following:

- [ ] Search the issue repository to ensure your report is a new issue
- [ ] Recreate the issue after disabling all extensions
- [ ] Simplify your code around the issue to better isolate the problem

Once submitted, your reported issue will be triaged by a Keywork maintainer as soon as possible.

## How can I contribute code to Keywork?

We deeply appreciate community contributions to Keywork.
To get started, you'll need a compatible development environment,
and an understanding of TypeScript, Deno, and Node.

## Requirements

- MacOS or \*nix
- Node (>= 17.4), preferrably [via NVM](https://github.com/nvm-sh/nvm)
- [Deno](https://deno.land/#installation) (>= 1.23)
- [Yarn](https://yarnpkg.com/getting-started) (>= 3)

After [forking Keywork](https://github.com/nirrius/keywork/fork) and cloning your repo,
you can start development via Yarn.

## Yarn Commands

### `install`

#### (Installs Node dependencies)

```shell title="Run in the root of your cloned repo."
yarn install
```

### `build:check`

This command Checks your development environment and ensures you can build Keywork.

```shell
yarn build:check
```

### `build`

This command builds all Keywork modules and formats the output.

```shell
yarn build
```

### `test`

#### (Run tests)

```shell
yarn test
```

## Thank You! 💞

Your contributions to open source, large or small, make great projects like this possible.
Thank you for taking the time to contribute.
