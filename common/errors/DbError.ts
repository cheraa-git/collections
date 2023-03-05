export class DbError extends Error {
  name: "DbError" = "DbError"
  error: unknown
  constructor(message: string, error?: unknown) {
    super()
    this.message = message
    this.error = error
  }
}
