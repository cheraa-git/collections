export class AuthError extends Error {
  name: "AuthError" = "AuthError"
  error: unknown
  constructor(message: string, error?: unknown) {
    super()
    this.message = message
    this.error = error
  }
}
