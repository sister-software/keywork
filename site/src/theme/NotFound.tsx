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

import { PageMetadata } from '@docusaurus/theme-common'
import Translate, { translate } from '@docusaurus/Translate'
import Layout from '@theme/Layout'
import React, { useEffect, useState } from 'react'
import { DocIssueURL } from '../components/DocIssueURL'
export default function NotFound() {
  const [query, setQuery] = useState<string>()
  const [searchURL, setSearchURL] = useState<string>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const query = decodeURIComponent(window.location.pathname)
      const searchURL = new URL('/search', window.location.href)
      searchURL.searchParams.set('query', query)

      setQuery(query)
      setSearchURL(searchURL.toString())
    }
  }, [])

  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className="container margin-vert--lg">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <div className="admonition admonition-caution alert alert--warning">
                <div className="admonition-heading">
                  <h1 className="hero__title">
                    <Translate id="theme.NotFound.title" description="The title of the 404 page">
                      Page Not Found
                    </Translate>
                  </h1>
                </div>

                <div className="admonition-content">
                  <p>We could not find what you were looking for.</p>
                  <p>It&#39;s possible the page you are looking for has moved between versions of Keywork.</p>
                  <ul>
                    {searchURL && query ? (
                      <li>
                        <a href={searchURL}>Search for &#34;{query}&#34;</a>
                      </li>
                    ) : null}

                    {query ? (
                      <li>
                        <DocIssueURL source_url={query}>Report a missing page.</DocIssueURL>
                      </li>
                    ) : null}

                    <li>
                      <a href={'/'}>Start over on the Keywork homepage</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  )
}
