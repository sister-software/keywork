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

import { load as loadMarkdownPlugin, MarkdownTheme, MarkdownThemeOptions } from 'keywork/docgen/theme'
import { projectRootPathBuilder } from 'keywork/node'
import * as TypeDoc from 'typedoc'
import { Logger, LogLevel } from 'typedoc'
import * as ts from 'typescript'

export class DocusaurusTypeDoc extends TypeDoc.Application {
  constructor(public program: ts.Program) {
    super()
    this.options.addReader(new TypeDoc.TSConfigReader())
  }

  getEntryPoints(): TypeDoc.DocumentationEntryPoint[] | undefined {
    const entryPoints: TypeDoc.DocumentationEntryPoint[] = []
    const tsConfigPaths = this.program.getCompilerOptions().paths!

    for (const importAlias in tsConfigPaths) {
      const [relativePath] = tsConfigPaths[importAlias]
      const entryPointPath = projectRootPathBuilder(relativePath)

      const sourceFile = this.program.getSourceFile(entryPointPath)

      if (!sourceFile) {
        throw new Error(`${entryPointPath} not found`)
      }

      entryPoints.push({
        displayName: relativePath,
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
      } catch (error: any) {
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
