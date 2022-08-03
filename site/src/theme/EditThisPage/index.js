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
import Translate from '@docusaurus/Translate'
import IconEdit from '@theme/Icon/Edit'
import React from 'react'

export default function EditThisPage({ editUrl }) {
  return (
    <a href={editUrl} target="_blank" rel="noreferrer noopener" className={ThemeClassNames.common.editThisPage}>
      <IconEdit />
      <a
        href="https://github.com/mdn/content/edit/main/files/en-us/mdn/about/index.md"
        title="You're going to need to sign in to GitHub first (Opens in a new tab)"
        target="_blank"
        rel="noopener noreferrer"
      >
        Edit on <b>GitHub</b>
      </a>

      <Translate id="theme.common.editThisPage" description="The link label to edit the current page">
        Edit this page
      </Translate>
    </a>
  )
}
