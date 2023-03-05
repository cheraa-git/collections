export class IndexError extends Error {
  name: 'IndexError' = 'IndexError'
  error: unknown
  constructor(message: string, error?: unknown) {
    super()
    this.message = message
    this.error = error
  }
}
