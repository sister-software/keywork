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

import * as fs from 'fs/promises'
import * as path from 'path'
import TypeDoc, { Logger, LogLevel } from 'typedoc'
import { load as loadMarkdownPlugin, MarkdownTheme, MarkdownThemeOptions } from './theme/index.ts'
import { checkFileExists } from '@keywork/monorepo/common/files'
import { PackageExports } from '@keywork/monorepo/common/imports'
import * as ProjectFiles from '@keywork/monorepo/common/project'
import { ts } from 'https://deno.land/x/ts_morph@15.1.0/bootstrap/ts_morph_bootstrap.js'

export interface CategoryConfig {
  name?: string
  label?: string
  dirName?: string
  collapsible?: boolean
  collapsed?: boolean
  position?: number
}

const defaultCategory: CategoryConfig = {
  collapsible: true,
  collapsed: true,
}

export class DocusaurusTypeDoc extends TypeDoc.Application {
  constructor(public program: ts.Program, public exports: PackageExports) {
    super()
    this.options.addReader(new TypeDoc.TSConfigReader())
  }

  categories = [
    { dirName: '', config: { label: 'API…' } },
    { dirName: 'classes', config: { label: 'Classes' } },
    { dirName: 'types', config: { label: 'Types' } },
    { dirName: 'variables', config: { label: 'Variables' } },
    { dirName: 'functions', config: { label: 'Functions' } },
    { dirName: 'interfaces', config: { label: 'Interfaces' } },
    { dirName: 'enums', config: { label: 'Enums' } },
  ]

  async generateDocs(project: TypeDoc.ProjectReflection, out: string) {
    await super.generateDocs(project, out)
    await fs.rm(path.join(out, 'modules'), { force: true, recursive: true })

    // Add a category configuration to the API root.
    for (const category of Object.values(this.categories)) {
      const categoryDir = path.join(out, category.dirName)
      const exists = await checkFileExists(categoryDir)

      if (!exists) continue

      await fs.mkdir(categoryDir, { recursive: true })
      await fs.writeFile(
        path.join(categoryDir, ProjectFiles.Category),
        JSON.stringify(
          {
            ...defaultCategory,
            position: 1,
            ...category.config,
          },
          null,
          2
        ),
        'utf8'
      )
    }
  }

  getEntryPoints(): TypeDoc.DocumentationEntryPoint[] | undefined {
    const entryPoints: TypeDoc.DocumentationEntryPoint[] = []

    for (const [namedExport, entry] of Object.entries(this.exports)) {
      if (namedExport.endsWith('.json')) continue

      const entryPointPath = path.join(ProjectFiles.ModulesDirectory, entry.import.replaceAll('.js', '.ts'))

      const sourceFile = this.program.getSourceFile(entryPointPath)

      if (!sourceFile) {
        throw new Error(`${entryPointPath} not found`)
      }

      const displayName = sourceFile.moduleName || namedExport

      entryPoints.push({
        displayName,
        program: this.program,
        sourceFile,
      })
    }

    return entryPoints
  }

  /**
   * Initialize TypeDoc with the given options object.
   * Patches the Markdown theme to better align with Docusaurus's expected output.
   *
   */
  bootstrap(options: Partial<TypeDoc.TypeDocOptions & MarkdownThemeOptions>) {
    for (const [key, val] of Object.entries(options)) {
      try {
        this.options.setValue(key as keyof TypeDoc.TypeDocOptions, val)
      } catch {
        // Ignore errors, plugins haven't been loaded yet and may declare an option.
      }
    }
    this.options.read(new Logger())

    const logger = this.loggerType
    if (typeof logger === 'function') {
      this.logger = new CallbackLogger(<any>logger)
      this.options.setLogger(this.logger)
    } else if (logger === 'none') {
      this.logger = new Logger()
      this.options.setLogger(this.logger)
    }
    this.logger.level = this.options.getValue('logLevel')

    loadMarkdownPlugin(this)

    this.options.reset()

    for (const [key, val] of Object.entries(options)) {
      try {
        this.options.setValue(key as any, val)
      } catch (error) {
        // ok(error instanceof Error);
        this.logger.error(error.message)
      }
    }
    this.options.read(this.logger)

    const renderer = this.renderer as any

    if (!renderer.themes.has('markdown')) {
      throw new Error('Markdown theme not present')
    }

    renderer.themes.set('markdown', MarkdownTheme)

    Object.defineProperty(this.renderer, 'cname', {
      get() {
        return ''
      },
    })

    Object.defineProperty(this.renderer, 'githubPages', {
      get() {
        return ''
      },
    })
  }
}

/**
 * A logger that calls a callback function.
 */
class CallbackLogger extends Logger {
  /**
   * This loggers callback function
   */
  callback: Function

  /**
   * Create a new CallbackLogger instance.
   *
   * @param callback  The callback that should be used to log messages.
   */
  constructor(callback: Function) {
    super()
    this.callback = callback
  }

  /**
   * Print a log message.
   *
   * @param message  The message itself.
   * @param level  The urgency of the log message.
   */
  override log(message: string, level: LogLevel) {
    super.log(message, level)
    this.callback(message, level)
  }
}
