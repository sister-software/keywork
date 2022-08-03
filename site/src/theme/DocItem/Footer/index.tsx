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
import IconEdit from '@theme/Icon/Edit'
import IconExternal from '@theme/Icon/ExternalLink'
import LastUpdated from '@theme/LastUpdated'
import TagsListInline from '@theme/TagsListInline'
import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.css'

function TagsRow(props) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterTagsRow, 'row margin-bottom--sm')}>
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  )
}

interface DocIssueURLProps {
  source_url?: string
}

const DocIssueURL: React.FC<DocIssueURLProps> = ({ source_url }) => {
  const url = new URL('https://github.com/nirrius/keywork/issues/new?labels=documentation&template=doc.md')
  url.searchParams.set('title', `Doc: ${source_url || 'Needs improvement'}`)

  return (
    <a
      href={url.toString()}
      title="You're going to need to sign in to GitHub first (Opens in a new tab)"
      target="_blank"
      rel="noopener noreferrer"
    >
      Report an issue with this content
      <IconExternal />
    </a>
  )
}

export default function DocItemFooter() {
  const { metadata } = useDoc()
  const { editUrl, lastUpdatedAt, formattedLastUpdatedAt, lastUpdatedBy, tags, frontMatter } = metadata
  const canDisplayTagsRow = tags.length > 0
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy)
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow

  if (!canDisplayFooter) {
    return null
  }

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
      {canDisplayTagsRow && <TagsRow tags={tags} />}

      <div className="admonition admonition-note alert alert--secondary">
        <div className="admonition-heading">
          <h3>Found a problem with this page?</h3>
        </div>

        <div className="admonition-content">
          <p>Keywork is made possible by software engineers like you!</p>
          <ul>
            {editUrl ? (
              <li>
                <a
                  href={editUrl}
                  title="You're going to need to sign in to GitHub first (Opens in a new tab)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Edit this file on <strong>GitHub</strong>
                  <IconEdit />
                </a>
              </li>
            ) : null}

            {frontMatter.source_url ? (
              <li>
                <a
                  href={frontMatter.source_url}
                  title="You're going to need to sign in to GitHub first (Opens in a new tab)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View this file&apos;s source code
                  <IconExternal />
                </a>
              </li>
            ) : null}

            <li>
              <DocIssueURL source_url={frontMatter.source_url} />
            </li>
          </ul>

          <div className="row">
            <div className={clsx('col', styles.lastUpdated)}>
              {(lastUpdatedAt || lastUpdatedBy) && (
                <LastUpdated
                  lastUpdatedAt={lastUpdatedAt}
                  formattedLastUpdatedAt={formattedLastUpdatedAt}
                  lastUpdatedBy={lastUpdatedBy}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
