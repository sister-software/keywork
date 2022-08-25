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

import { useThemeConfig } from '@docusaurus/theme-common'
import { translate } from '@docusaurus/Translate'
import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.css'

export default function Heading({ as: As, id, ...props }) {
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig()
  // H1 headings do not need an id because they don't appear in the TOC.
  if (As === 'h1' || !id) {
    return <As {...props} id={undefined} />
  }
  return (
    <As
      {...props}
      className={clsx(
        'anchor',
        hideOnScroll ? styles.anchorWithHideOnScrollNavbar : styles.anchorWithStickyNavbar,
        props.className
      )}
      id={id}
    >
      {props.children}
      <a
        className="hash-link"
        href={`#${id}`}
        title={translate({
          id: 'theme.common.headingLinkTitle',
          message: 'Direct link to heading',
          description: 'Title for link to heading',
        })}
      >
        &#8203;
      </a>
    </As>
  )
}
