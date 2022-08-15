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

import Link from '@docusaurus/Link'
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames, usePluralForm } from '@docusaurus/theme-common'
import Translate, { translate } from '@docusaurus/Translate'
import Layout from '@theme/Layout'
import SearchMetadata from '@theme/SearchMetadata'
import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.css'

// Very simple pluralization: probably good enough for now
function useNDocsTaggedPlural() {
  const { selectMessage } = usePluralForm()
  return (count) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.docs.tagDocListPageTitle.nDocsTagged',
          description:
            'Pluralized label for "{count} docs tagged". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One doc tagged|{count} docs tagged',
        },
        { count }
      )
    )
}
function DocItem({ doc }) {
  return (
    <article className={styles.tagEntry}>
      <Link to={doc.permalink}>
        <h2>{doc.title}</h2>
      </Link>
      {doc.description && <p>{doc.description}</p>}
    </article>
  )
}
export default function DocTagDocListPage({ tag }) {
  const nDocsTaggedPlural = useNDocsTaggedPlural()
  const title = translate(
    {
      id: 'theme.docs.tagDocListPageTitle',
      description: 'The title of the page for a docs tag',
      message: '{nDocsTagged} with "{tagName}"',
    },
    { nDocsTagged: nDocsTaggedPlural(tag.count), tagName: tag.label }
  )
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.docsPages, ThemeClassNames.page.docsTagDocListPage)}>
      <PageMetadata title={title} />
      <SearchMetadata tag="doc_tag_doc_list" />
      <Layout>
        <div className="container margin-vert--lg">
          <div className="row">
            <main className="col col--8 col--offset-2">
              <header className="margin-bottom--lg">
                <h1>{title}</h1>
                <Link href={tag.allTagsPath}>
                  <Translate
                    id="theme.tags.tagsPageLink"
                    description="The label of the link targeting the tag list page"
                  >
                    View All Tags
                  </Translate>
                </Link>
              </header>
              <section className="margin-vert--sm">
                {tag.items.map((doc) => (
                  <DocItem key={doc.id} doc={doc} />
                ))}
              </section>
            </main>
          </div>
        </div>
      </Layout>
    </HtmlClassNameProvider>
  )
}
