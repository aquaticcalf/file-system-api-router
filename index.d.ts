import type { Application } from 'express'

/**
 * Recursively traverse the API directory and register routes on the Express app.
 *
 * @param app - Your Express application.
 * @param apiDir - The base API directory (relative paths are resolved from process.cwd()).
 * @returns A Promise that resolves when all routes have been registered.
 */

export function registerRoutes(app: Application, apiDir: string): Promise<void>

