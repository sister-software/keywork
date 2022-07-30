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

import Content from '@theme-original/DocSidebar/Desktop/Content'
import NavbarLogo from '@theme/Navbar/Logo'
import React from 'react'

export default function ContentWrapper(props) {
  return (
    <>
      <div className="background-container" />
      <div className="menu_---node_modules-@docusaurus-theme-classic-lib-theme-DocSidebar-Desktop-Content-styles-module">
        <ul className="theme-doc-sidebar-menu menu__list">
          <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item">
            <NavbarLogo />
          </li>
        </ul>
      </div>
      <Content {...props} />
    </>
  )
}
