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

import * as ProjectFiles from '@keywork/docgen/project'
import { mkdirSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'
import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  Renderer,
  RendererEvent,
  Theme,
  UrlMapping,
} from 'typedoc'
import { getKindPlural } from './groups'
import { NavigationItem } from './navigation-item'
import {
  indexTemplate,
  reflectionMemberTemplate,
  reflectionTemplate,
  registerHelpers,
  registerPartials,
} from './render-utils'
import { formatContents } from './utils'
import { readFileChangeFromGit } from './utils/sources'

const NEVER_RENDER: `@${string}`[] = [
  //
  '@copyright',
  '@license',
  '@author',
  '@file',
  '@deprecated',
  '@keyword',
  '@tag',
]

export interface CategoryConfig {
  name?: string
  label: string
  dirName?: string
  collapsible?: boolean
  collapsed?: boolean
  position: number
}

const defaultCategory: Partial<CategoryConfig> = {
  collapsible: true,
  collapsed: true,
}

interface Mapping {
  kind: ReflectionKind[]
  isLeaf: boolean
  directory: string
  categoryConfig: CategoryConfig
  template: (pageEvent: PageEvent<ContainerReflection>) => string
}

export class MarkdownTheme extends Theme {
  allReflectionsHaveOwnDocument!: boolean
  entryDocument: string
  entryPoints!: string[]
  filenameSeparator!: string
  hideBreadcrumbs!: boolean
  hideInPageTOC!: boolean
  hidePageTitle!: boolean
  hideMembersSymbol!: boolean
  includes!: string
  indexTitle!: string
  mediaDirectory!: string
  namedAnchors!: boolean
  readme!: string
  out!: string
  publicPath!: string
  preserveAnchorCasing!: boolean

  project?: ProjectReflection
  reflection?: DeclarationReflection
  location!: string
  anchorMap: Record<string, string[]> = {}

  static URL_PREFIX = /^(http|ftp)s?:\/\//

  constructor(renderer: Renderer) {
    super(renderer)

    // prettier-ignore
    this.allReflectionsHaveOwnDocument = this.getOption('allReflectionsHaveOwnDocument',) as boolean;
    this.entryDocument = this.getOption('entryDocument') as string
    this.entryPoints = this.getOption('entryPoints') as string[]
    this.filenameSeparator = this.getOption('filenameSeparator') as string
    this.hideBreadcrumbs = this.getOption('hideBreadcrumbs') as boolean
    this.hideInPageTOC = this.getOption('hideInPageTOC') as boolean
    this.hidePageTitle = this.getOption('hidePageTitle') as boolean
    this.hideMembersSymbol = this.getOption('hideMembersSymbol') as boolean
    this.includes = this.getOption('includes') as string
    this.indexTitle = this.getOption('indexTitle') as string
    this.mediaDirectory = this.getOption('media') as string
    this.namedAnchors = this.getOption('namedAnchors') as boolean
    this.readme = this.getOption('readme') as string
    this.out = this.getOption('out') as string
    this.publicPath = this.getOption('publicPath') as string
    this.preserveAnchorCasing = this.getOption('preserveAnchorCasing') as boolean

    this.listenTo(this.owner, {
      [RendererEvent.BEGIN]: this.onBeginRenderer,
      [PageEvent.BEGIN]: this.onBeginPage,
    })

    registerPartials()
    registerHelpers(this)
  }

  render(page: PageEvent<Reflection>): string {
    return formatContents(page.template(page) as string)
  }

  getOption(key: string) {
    return this.application.options.getValue(key)
  }

  getUrls(project: ProjectReflection) {
    const urls: UrlMapping[] = []

    project.children?.forEach((child) => {
      child.groups?.forEach((group) => {
        if (group.title === 'References') {
          group.title = 'Exports'
        }
      })
    })

    if (process.env.NODE_ENV === 'production') {
      for (const reflection of Object.values(project.reflections)) {
        for (const source of reflection.sources || []) {
          readFileChangeFromGit(source)
        }
      }
    }

    const noReadmeFile = this.readme.endsWith('none')
    if (noReadmeFile) {
      project.url = this.entryDocument
      urls.push(new UrlMapping(this.entryDocument, project, this.getReflectionTemplate() as any))
    } else {
      project.url = this.globalsFile
      urls.push(new UrlMapping(this.globalsFile, project, this.getReflectionTemplate() as any))
      urls.push(new UrlMapping(this.entryDocument, project, this.getIndexTemplate() as any))
    }
    project.children?.forEach((child: Reflection) => {
      if (child instanceof DeclarationReflection) {
        this.buildUrls(child as DeclarationReflection, urls)
      }
    })
    return urls
  }

  buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[] {
    const mapping = this.mappings.find((mapping) => reflection.kindOf(mapping.kind))
    const comment = reflection.comment

    if (comment) {
      NEVER_RENDER.forEach((tag) => comment.removeTags(tag))

      if (reflection.kind === ReflectionKind.Module) {
        comment.removeTags('@remarks')
        comment.removeTags('@see')
      }
    }

    if (mapping) {
      if (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url)) {
        const url = this.toUrl(mapping, reflection)

        urls.push(new UrlMapping(url, reflection, mapping.template as any))
        reflection.url = url
        reflection.hasOwnDocument = true

        const categoryPath = path.dirname(path.join(this.out, url))
        mkdirSync(categoryPath, { recursive: true })
        writeFileSync(
          path.join(categoryPath, ProjectFiles.Category),
          JSON.stringify(mapping.categoryConfig, null, 2),
          'utf8'
        )
      }

      for (const child of reflection.children || []) {
        if (mapping.isLeaf) {
          this.applyAnchorUrl(child, reflection)
        } else {
          this.buildUrls(child, urls)
        }
      }
    } else if (reflection.parent) {
      this.applyAnchorUrl(reflection, reflection.parent, true)
    }
    return urls
  }

  toUrl(mapping: Mapping, reflection: DeclarationReflection) {
    return this.getUrl(mapping, reflection) + '.mdx'
  }

  getUrl(mapping: Mapping, reflection: Reflection, relative?: Reflection): string {
    let url = reflection.originalName

    if (reflection.parent && reflection.parent !== relative) {
      if (!(reflection.parent instanceof ProjectReflection)) {
        url = path.posix.join(this.getUrl(mapping, reflection.parent, relative), url)
      } else {
        const parsed = path.posix.parse(reflection.originalName)
        const lastSegment = path.posix.join(mapping.kind[0] === ReflectionKind.Module ? 'README' : mapping.directory)
        url = path.posix.join(parsed.dir, parsed.base, lastSegment)
      }
    }

    return path.posix.normalize(url.replace(/^_/, ''))
  }

  applyAnchorUrl(reflection: Reflection, container: Reflection, isSymbol = false) {
    if (container.url && (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url))) {
      const reflectionId = this.preserveAnchorCasing ? reflection.name : reflection.name.toLowerCase()

      if (isSymbol) {
        this.anchorMap[container.url]
          ? this.anchorMap[container.url].push(reflectionId)
          : (this.anchorMap[container.url] = [reflectionId])
      }

      const count = this.anchorMap[container.url]?.filter((id) => id === reflectionId)?.length

      const anchor = this.toAnchorRef(reflectionId + (count > 1 ? '-' + (count - 1).toString() : ''))

      reflection.url = container.url + '#' + anchor
      reflection.anchor = anchor
      reflection.hasOwnDocument = false
    }
    reflection.traverse((child) => {
      if (child instanceof DeclarationReflection) {
        this.applyAnchorUrl(child, container)
      }
    })
  }

  toAnchorRef(reflectionId: string) {
    return reflectionId
  }

  getRelativeUrl(absolute: string) {
    if (MarkdownTheme.URL_PREFIX.test(absolute)) {
      return absolute
    } else {
      const relative = path.relative(path.dirname(this.location), path.dirname(absolute))
      return path.join(relative, path.basename(absolute)).replace(/\\/g, '/')
    }
  }

  getReflectionTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) => {
      return reflectionTemplate(pageEvent, {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        data: { theme: this },
      })
    }
  }

  getReflectionMemberTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) => {
      return reflectionMemberTemplate(pageEvent, {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        data: { theme: this },
      })
    }
  }

  getIndexTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) => {
      return indexTemplate(pageEvent, {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        data: { theme: this },
      })
    }
  }

  getNavigation(project: ProjectReflection) {
    const urls = this.getUrls(project)

    const getUrlMapping = (name: string) => {
      if (!name) {
        return ''
      }
      return urls.find((url) => url.model.name === name)
    }

    const createNavigationItem = (
      title: string,
      url: string | undefined,
      isLabel: boolean,
      children: NavigationItem[] = []
    ) => {
      const navigationItem = new NavigationItem(title, url)

      navigationItem.isLabel = isLabel
      navigationItem.children = children
      const { reflection, parent, ...filteredNavigationItem } = navigationItem
      return filteredNavigationItem as NavigationItem
    }
    const navigation = createNavigationItem(project.name, undefined, false)
    const hasReadme = !this.readme.endsWith('none')
    if (hasReadme) {
      navigation.children?.push(createNavigationItem('Readme', this.entryDocument, false))
    }
    if (this.entryPoints.length === 1) {
      navigation.children?.push(
        createNavigationItem('Exports', hasReadme ? this.globalsFile : this.entryDocument, false)
      )
    }
    this.mappings.forEach((mapping) => {
      const kind = mapping.kind[0]
      const items = project.getReflectionsByKind(kind)
      if (items.length > 0) {
        const children = items.map((item) =>
          createNavigationItem(item.getFullName(), (getUrlMapping(item.name) as any)?.url as string, true)
        )
        // .sort((a, b) => (a.title > b.title ? 1 : -1))
        const group = createNavigationItem(getKindPlural(kind), undefined, true, children)
        navigation.children?.push(group)
      }
    })
    return navigation
  }

  mappings: Mapping[] = [
    {
      kind: [ReflectionKind.Module],
      isLeaf: false,
      directory: 'modules',
      template: this.getReflectionTemplate(),
      categoryConfig: {
        ...defaultCategory,
        label: 'API…',
        position: 1.5,
      },
    },
    {
      kind: [ReflectionKind.Namespace],
      isLeaf: false,
      directory: 'modules',
      template: this.getReflectionTemplate(),
      categoryConfig: {
        ...defaultCategory,
        label: 'API…',
        position: 1.5,
      },
    },
    {
      kind: [ReflectionKind.Enum],
      isLeaf: false,
      directory: 'enums',
      template: this.getReflectionTemplate(),
      categoryConfig: {
        ...defaultCategory,
        label: 'Enums',
        position: 3,
      },
    },
    {
      kind: [ReflectionKind.Class],
      isLeaf: false,
      directory: 'classes',
      template: this.getReflectionTemplate(),
      categoryConfig: {
        ...defaultCategory,
        label: 'Classes',
        position: 100,
      },
    },
    {
      kind: [ReflectionKind.Interface],
      isLeaf: false,
      directory: 'interfaces',
      template: this.getReflectionTemplate(),
      categoryConfig: {
        ...defaultCategory,
        label: 'Interfaces',
        position: 101,
      },
    },
    {
      kind: [ReflectionKind.TypeAlias],
      isLeaf: true,
      directory: 'types',
      template: this.getReflectionMemberTemplate(),
      categoryConfig: {
        ...defaultCategory,
        label: 'Types',
        position: 104,
      },
    },
    {
      kind: [ReflectionKind.Variable],
      isLeaf: true,
      directory: 'variables',
      template: this.getReflectionMemberTemplate(),
      categoryConfig: {
        ...defaultCategory,
        label: 'Variables',
        position: 105,
      },
    },
    {
      kind: [ReflectionKind.Function],
      isLeaf: true,
      directory: 'functions',
      template: this.getReflectionMemberTemplate(),
      categoryConfig: {
        ...defaultCategory,
        position: 102,
        label: 'Functions',
      },
    },
  ]

  /**
   * Triggered before the renderer starts rendering a project.
   *
   * @param event  An event object describing the current render operation.
   */
  protected onBeginRenderer(event: RendererEvent) {
    this.project = event.project
  }

  /**
   * Triggered before a document will be rendered.
   *
   * @param page  An event object describing the current render operation.
   */
  protected onBeginPage(page: PageEvent) {
    this.location = page.url
    this.reflection = page.model instanceof DeclarationReflection ? page.model : undefined
  }

  get globalsFile() {
    return 'modules.md'
  }
}
