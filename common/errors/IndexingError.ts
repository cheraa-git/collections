export class IndexingError extends Error {
  name: 'IndexingError' = 'IndexingError'
  error: unknown
  constructor(message: string, error?: unknown) {
    super()
    this.message = message
    this.error = error
  }
}
