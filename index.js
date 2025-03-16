import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

// supported HTTP methods
const validMethods = ['get', 'post', 'put', 'patch', 'delete']

/**
 * Convert a segment wrapped in square brackets to a dynamic parameter.
 * E.g. [userId] becomes :userId
 *
 * @param {string} segment - The folder or file segment.
 * @returns {string} - The converted route segment.
 */

function convertSegment(segment) {
  const match = segment.match(/^\[(.+?)\]$/)
  return match ? `:${match[1]}` : segment
}

/**
 * Recursively traverse the API directory and register routes on the Express app.
 *
 * @param {import('express').Application} app - Your Express application.
 * @param {string} apiDir - The base API directory (relative paths are resolved from process.cwd()).
 */

export async function registerRoutes(app, apiDir) {
  // convert apiDir to an absolute path if it's not already.
  const absoluteApiDir = path.isAbsolute(apiDir)
    ? apiDir
    : path.resolve(process.cwd(), apiDir)

  async function walkDir(currentDir, routeSegments) {
    const files = fs.readdirSync(currentDir)
    for (const file of files) {
      const absolutePath = path.join(currentDir, file)
      const stat = fs.statSync(absolutePath)
      if (stat.isDirectory()) {
        // use the directory name as a route segment (skip "index" directories)
        const segment = file === 'index' ? '' : convertSegment(file)
        const newSegments = segment ? [...routeSegments, segment] : routeSegments
        await walkDir(absolutePath, newSegments)
      } else if (file.endsWith('.js') || file.endsWith('.ts')) {
        // get the file base (e.g. "get", "post")
        const fileBase = file.slice(0, -3).toLowerCase()

        // dynamically import the module using its file URL.
        const module = await import(pathToFileURL(absolutePath).href)
        const handler = module.default || module

        if (validMethods.includes(fileBase)) {
          // if the file name is a valid HTTP method, register that method.
          const route = '/' + routeSegments.filter(Boolean).join('/')
          console.log(`Registering route [${fileBase.toUpperCase()} ${route || '/'}] from ${absolutePath}`)
          app[fileBase](route || '/', handler)
        } else {
          // otherwise, assume the file name is an additional literal segment.
          const segment = convertSegment(fileBase)
          const route = '/' + [...routeSegments, segment].filter(Boolean).join('/')
          console.log(`Registering route [ALL ${route || '/'}] from ${absolutePath}`)
          app.all(route || '/', handler)
        }
      }
    }
  }

  await walkDir(absoluteApiDir, [])
}

