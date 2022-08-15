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

import IconExternal from '@theme/Icon/ExternalLink'
import React from 'react'

interface DocIssueURLProps {
  source_url?: string
}

export const DocIssueURL: React.FC<DocIssueURLProps> = ({ source_url, children }) => {
  const url = new URL('https://github.com/nirrius/keywork/issues/new?labels=documentation&template=doc.md')
  url.searchParams.set('title', `Doc: ${source_url || 'Needs improvement'}`)

  return (
    <a
      href={url.toString()}
      title="You're going to need to sign in to GitHub first (Opens in a new tab)"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <IconExternal />
    </a>
  )
}
