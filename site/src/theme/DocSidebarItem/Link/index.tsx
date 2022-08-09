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

import isInternalUrl from '@docusaurus/isInternalUrl'
import Link from '@docusaurus/Link'
import { ThemeClassNames } from '@docusaurus/theme-common'
// @ts-expect-error internal
import { isActiveSidebarItem } from '@docusaurus/theme-common/internal'
import IconExternalLink from '@theme/Icon/ExternalLink'
import clsx from 'clsx'
import React from 'https://esm.sh/react@18.2.0'
import styles from './styles.module.css'

export default function DocSidebarItemLink({ item, onItemClick, activePath, level, index, ...props }) {
  const { href, label, className } = item
  const isActive = isActiveSidebarItem(item, activePath)
  const isInternalLink = isInternalUrl(href)
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        'menu__list-item--collapsed',
        className
      )}
      key={label}
    >
      <Link
        className={clsx(
          'menu__link menu__link--sublist menu__link--sublist-caret',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          }
        )}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}
        aria-expanded="true"
      >
        {label}
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  )
}
