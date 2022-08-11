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

// @ts-expect-error internal
import { useDocsSidebar } from '@docusaurus/theme-common/internal'
import BackToTopButton from '@theme/BackToTopButton'
import DocPageLayoutMain from '@theme/DocPage/Layout/Main'
import DocPageLayoutSidebar from '@theme/DocPage/Layout/Sidebar'
import Layout from '@theme/Layout'
import React, { useState } from 'react'
import styles from './styles.module.css'

export default function DocPageLayout({ children }) {
  const sidebar = useDocsSidebar()
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false)
  return (
    <Layout wrapperClassName={styles.docsWrapper}>
      <BackToTopButton />
      <div className={styles.docPage}>
        {sidebar && (
          <DocPageLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocPageLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>{children}</DocPageLayoutMain>
      </div>
    </Layout>
  )
}
