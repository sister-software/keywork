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
import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.css'

interface TagProps {
  permalink: string
  label: string
  count?: number
}

const Tag: React.FC<TagProps> = ({ permalink, label, count }) => {
  return (
    <Link
      href={permalink}
      className={clsx(styles.tag, count ? styles.tagWithCount : styles.tagRegular)}
      data-label={label.toLowerCase()}
    >
      {label}
      {count && <span>{count}</span>}
    </Link>
  )
}

export default Tag
