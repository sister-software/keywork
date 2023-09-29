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

import { CachableResponse, CacheControlDirectives, fileExtensionToContentTypeHeader } from 'keywork/http'
import { RequestRouter, RequestRouterOptions, RouteRequestHandler } from 'keywork/router'
import { open, stat } from 'node:fs/promises'
import * as path from 'node:path'

export interface StaticFileRequestHandlerParams {
  [0]: string
}

export interface NodeStaticFileRouterOptions extends RequestRouterOptions {
  /**
   * The local path to the directory containing static files.
   * @default 'public' relative to the router script
   */
  filesDirectoryPath: string

  /**
   * The URL path to serve static files from.
   * @default '/*'
   */
  mountPath?: string

  cacheControlOptions?: Partial<CacheControlDirectives>
}

/**
 * A simple router for serving static files.
 *
 * @platform node
 */
export class NodeStaticFileRouter extends RequestRouter {
  public readonly filesDirectoryPath: string
  public readonly cacheControlOptions?: Partial<CacheControlDirectives>

  constructor({ filesDirectoryPath, mountPath = '/*', ...routerOptions }: NodeStaticFileRouterOptions) {
    super({
      displayName: 'Static File Router',
      ...routerOptions,
    })

    this.filesDirectoryPath = filesDirectoryPath
    this.cacheControlOptions = routerOptions.cacheControlOptions
    this.get(mountPath, this.fetchStaticFile)
  }

  public fetchStaticFile: RouteRequestHandler<any, StaticFileRequestHandlerParams> = async (
    { request, params },
    next
  ) => {
    const filePath = params[0]

    if (!filePath) return next()

    const filePathAbsolute = path.join(this.filesDirectoryPath, filePath)

    const fileExists = await stat(filePathAbsolute)
      .then((fileStat) => fileStat.isFile())
      .catch(() => false)

    if (!fileExists) {
      console.log('....', filePathAbsolute)
      return next()
    }

    // Let's start by creating a web native transform stream.
    // We can use this to transform the file stream into a web native readable stream.
    const bodyStream = new TransformStream()
    const bodyWriter = bodyStream.writable.getWriter()

    // Next, we'll need to create a Node readable stream from the file...
    const fileHandle = await open(filePathAbsolute, 'r')
    const nodeFileStream = fileHandle.createReadStream()

    nodeFileStream.on('end', () => {
      bodyWriter.close()
    })

    // We'll also need to handle errors.
    nodeFileStream.on('error', (error) => {
      this.logger.error(error)
      bodyWriter.abort(error)
    })

    nodeFileStream.on('readable', () => {
      let chunk: Buffer | null
      while (null !== (chunk = nodeFileStream.read())) {
        bodyWriter.write(chunk)
      }
    })

    return new CachableResponse(bodyStream.readable, request, undefined, this.cacheControlOptions, {
      ...fileExtensionToContentTypeHeader(filePath),
    })
  }
}
