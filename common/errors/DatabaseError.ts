export class DatabaseError extends Error {
  name: "DatabaseError" = "DatabaseError"
  error: unknown
  constructor(message: string, error?: unknown) {
    super()
    this.message = message
    this.error = error
  }
}
