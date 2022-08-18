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

import { ThemeClassNames } from '@docusaurus/theme-common'
// @ts-expect-error internal
import { useDoc } from '@docusaurus/theme-common/internal'
import Heading from '@theme/Heading'
import MDXContent from '@theme/MDXContent'
import clsx from 'clsx'
import React from 'react'

/**
 * Title can be declared inside md content or declared through
 * front matter and added manually. To make both cases consistent,
 * the added title is added under the same div.markdown block
 * See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
 *
 * We render a "synthetic title" if:
 * - user doesn't ask to hide it with front matter
 * - the markdown content does not already contain a top-level h1 heading
 */
function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc()
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined'
  if (!shouldRender) {
    return null
  }
  return metadata.title
}

export default function DocItemContent({ children }) {
  const syntheticTitle = useSyntheticTitle()

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown', 'thin-scrollbar')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1" className="doc-title">
            {syntheticTitle}
          </Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  )
}
