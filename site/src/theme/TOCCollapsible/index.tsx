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

import { Collapsible, useCollapsible } from '@docusaurus/theme-common'
import CollapseButton from '@theme/TOCCollapsible/CollapseButton'
import TOCItems from '@theme/TOCItems'
import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.css'
export default function TOCCollapsible({ toc, className, minHeadingLevel, maxHeadingLevel }) {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })
  return (
    <div className={clsx(styles.tocCollapsible, !collapsed && styles.tocCollapsibleExpanded, className)}>
      <CollapseButton collapsed={collapsed} onClick={toggleCollapsed} />
      <Collapsible lazy className={styles.tocCollapsibleContent} collapsed={collapsed}>
        <TOCItems toc={toc} minHeadingLevel={minHeadingLevel} maxHeadingLevel={maxHeadingLevel} />
      </Collapsible>
    </div>
  )
}
