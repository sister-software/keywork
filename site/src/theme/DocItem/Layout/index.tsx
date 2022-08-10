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

import { useWindowSize } from '@docusaurus/theme-common'
// @ts-expect-error internal
import { useDoc } from '@docusaurus/theme-common/internal'
import DocItemContent from '@theme/DocItem/Content'
import DocItemFooter from '@theme/DocItem/Footer'
import DocItemPaginator from '@theme/DocItem/Paginator'
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop'
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocVersionBanner from '@theme/DocVersionBanner'
import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.css'

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const { frontMatter, toc } = useDoc()
  const windowSize = useWindowSize()
  const hidden = frontMatter.hide_table_of_contents
  const canRender = !hidden && toc.length > 0
  const mobile = canRender ? <DocItemTOCMobile /> : undefined
  const desktop = canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? <DocItemTOCDesktop /> : undefined
  return {
    hidden,
    mobile,
    desktop,
  }
}
export default function DocItemLayout({ children }) {
  const docTOC = useDocTOC()
  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>
              <>{children}</>
            </DocItemContent>
          </article>
          <DocItemPaginator />
          <DocItemFooter />
          {/* <DocBreadcrumbs /> */}
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  )
}
